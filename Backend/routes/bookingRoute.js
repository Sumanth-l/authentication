const router = require("express").Router();
const pool=require('../db')


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


module.exports = router;