const router = require("express").Router();
const pool=require('../db')
const verifyToken=require('../middlewear/verifyToken')


router.get("/rooms",async(req,res)=>{

  try {
    await pool.query("DELETE FROM room_locks WHERE expiry_time < NOW()");
    const result=await pool.query(`SELECT r.id, r.room_number,
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


router.get('/hotels',async(req,res)=>{

    try {
       const result = await pool.query(`
      SELECT h.id, h.name, h.location, h.address,
      COUNT(r.id) AS total_rooms
      FROM hotels h
      LEFT JOIN rooms r ON h.id = r.hotel_id
      GROUP BY h.id
      ORDER BY h.id;
    `);
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({
            message: "Error fetching hotels",
            error: error.message
        })
    }

})


router.get('/hotels/:hotel_id/rooms', async (req, res) => {
  try {
    const { hotel_id } = req.params;

    const result = await pool.query(`
      SELECT 
        r.id,
        r.hotel_id,
        r.room_number,
        r.room_type,
        r.price,
        r.max_guests,
        r.description,
        r.image_url,
        CASE 
          WHEN rl.room_id IS NOT NULL 
               AND rl.expiry_time > NOW()
          THEN 'NOT_AVAILABLE'
          ELSE 'AVAILABLE'
        END AS status
      FROM rooms r
      LEFT JOIN room_locks rl 
        ON r.id = rl.room_id
      WHERE r.hotel_id = $1
      ORDER BY r.room_number;
    `, [hotel_id]);

    res.status(200).json(result.rows);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching rooms",
      error: error.message
    });
  }
});

router.get('/hotels/:hotel_id/rooms/:room_id',async(req,res)=>{
    const {room_id,hotel_id}=req.params;
    try {
       const result=await pool.query("SELECT * FROM rooms WHERE id=$1 AND hotel_id=$2",[room_id, hotel_id])
        if(result.rows.length===0){
            return res.status(404).json({message:"Room not found"})
        }
        res.status(200).json(result.rows[0])
        
    } catch (error) {
        res.status(500).json({
            message: "Error fetching room",
            error: error.message
        })
    }
})




module.exports = router;