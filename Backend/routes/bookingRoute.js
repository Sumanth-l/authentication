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
    
    const { room_id} = req.body;
    const user_id = req.user.id; 
    console.log(user_id)

    // delete expired locks
    await pool.query("DELETE FROM room_locks WHERE expiry_time < NOW()");

    // check if room already locked
    const lockcheck = await pool.query(
      "SELECT * FROM room_locks WHERE room_id=$1 AND expiry_time > NOW()",
      [room_id]
    );

    if (lockcheck.rows.length > 0) {
      return res.status(400).json({ message: "Room is already locked" });
    }

    // lock room for 5 minutes
    const lockRoom = await pool.query(
      `INSERT INTO room_locks(room_id, user_id, expiry_time)
       VALUES($1, $2, NOW() + INTERVAL '5 minutes')
       RETURNING *`,
      [room_id, user_id]
    );

    return res.status(200).json({
      message: "Room locked successfully",
      lock: lockRoom.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: "Error locking room",
      error: error.message,
    });
  }
});



module.exports = router;