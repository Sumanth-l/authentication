const pool=require('./db')

async function testdb() {
    try {
        const res=await pool.query("SELECT NOW()")
        console.log(res.rows)
    } catch (error) {
        console.log(error)
    }
}

testdb();