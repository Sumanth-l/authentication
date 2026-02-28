const router = require("express").Router();
const pool = require('../db')
const verifyToken = require('../middlewear/verifyToken')


router.get("/rooms", async (req, res) => {

  try {
    await pool.query("DELETE FROM room_locks WHERE expiry_time < NOW()");
    const result = await pool.query(`SELECT r.id, r.room_number,
      CASE 
      WHEN rl.room_id IS NOT NULL THEN 'NOT_AVAILABLE'
      ELSE 'AVAILABLE'
      END AS status
      FROM rooms r
      LEFT JOIN room_locks rl 
      ON r.id = rl.room_id
      ORDER BY r.room_number;`)
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching rooms",
      error: error.message
    });
  }
})

router.post("/room/lock", verifyToken, async (req, res) => {
  try {
    const { room_id } = req.body;
    const user_id = req.user.id;


    const lockRoom = await pool.query(
      `
      INSERT INTO room_locks(room_id, user_id, expiry_time)
      VALUES($1, $2, NOW() + INTERVAL '5 minutes')
      ON CONFLICT (room_id)
      DO UPDATE SET
        user_id = EXCLUDED.user_id,
        expiry_time = EXCLUDED.expiry_time
      WHERE room_locks.expiry_time < NOW()
      RETURNING *;
      `,
      [room_id, user_id]
    );

    if (lockRoom.rows.length === 0) {
      return res.status(400).json({
        message: "Room is already locked by another user ❌"
      });
    }

    return res.status(200).json({
      message: "Room locked successfully ✅",
      lock: lockRoom.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: "Error locking room",
      error: error.message,
    });
  }
});


//calculate the distance
router.get("/hotels", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // No location → return normally
    if (!lat || !lng) {
      const result = await pool.query(
        "SELECT * FROM hotels ORDER BY id ASC"
      );
      return res.json(result.rows);
    }

    const result = await pool.query(
      `
      SELECT *,
      CASE
        WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN
          (
            6371 * acos(
              cos(radians($1)) *
              cos(radians(latitude)) *
              cos(radians(longitude) - radians($2)) +
              sin(radians($1)) *
              sin(radians(latitude))
            )
          )
        ELSE NULL
      END AS distance
      FROM hotels
      ORDER BY distance ASC NULLS LAST
      `,
      [lat, lng]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/hotels/:hotel_id/rooms', async (req, res) => {
  try {
    const { hotel_id } = req.params;

    const result = await pool.query(`
      SELECT r.id,
             r.room_number,
             r.room_type,
             r.price,
             r.max_guests,
             r.description,
             r.image_url,
             CASE
               WHEN EXISTS (
                 SELECT 1 FROM bookings b
                 WHERE b.room_id = r.id
                 AND CURRENT_DATE >= b.check_in
                 AND CURRENT_DATE < b.check_out
               )
               THEN 'NOT_AVAILABLE'
               ELSE 'AVAILABLE'
             END AS status
      FROM rooms r
      WHERE r.hotel_id = $1
      ORDER BY r.room_number
    `, [hotel_id]);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/hotels/:hotel_id/rooms/:room_id', async (req, res) => {
  const { room_id, hotel_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM rooms WHERE id=$1 AND hotel_id=$2", [room_id, hotel_id])
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" })
    }
    res.status(200).json(result.rows[0])

  } catch (error) {
    res.status(500).json({
      message: "Error fetching room",
      error: error.message
    })
  }
})

//calender
router.get("/rooms/:room_id/booked-dates", async (req, res) => {
  try {
    const { room_id } = req.params;

    const result = await pool.query(
      `SELECT check_in, check_out
       FROM bookings
       WHERE room_id = $1`,
      [room_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/booking/create", verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      room_id,
      check_in,
      check_out,
      guests,
      full_name,
      phone,
      payment_method
    } = req.body;

    console.log("BODY:", req.body);

    // 🔥 CHECK DATE CONFLICT
    const conflict = await pool.query(
      `SELECT * FROM bookings
       WHERE room_id = $1
       AND $2 < check_out
       AND $3 > check_in`,
      [room_id, check_in, check_out]
    );

    if (conflict.rows.length > 0) {
      return res.status(400).json({
        message: "Room already booked for selected dates ❌"
      });
    }

    // 🔥 INSERT BOOKING
    const result = await pool.query(
      `INSERT INTO bookings
       (user_id, room_id, check_in, check_out, guests, full_name, phone, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [user_id, room_id, check_in, check_out, guests, full_name, phone, payment_method]
    );

    // remove temporary lock
    await pool.query("DELETE FROM room_locks WHERE room_id=$1", [room_id]);

    res.status(201).json({
      message: "Booking successful 🎉",
      booking: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
});


router.get("/hotels/nearest", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and Longitude required"
      });
    }

    const result = await pool.query(
      `
      SELECT *,
      (
        6371 * acos(
          cos(radians($1)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) *
          sin(radians(latitude))
        )
      ) AS distance
      FROM hotels
      WHERE latitude IS NOT NULL
      AND longitude IS NOT NULL
      ORDER BY distance ASC
      LIMIT 1
      `,
      [lat, lng]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No nearby hotels found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/hotels/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    res.json(result.rows[0]);   // 🔥 IMPORTANT
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
