const express = require("express");
const pool = require('../config')

const router = express.Router();

// Get comment
router.get('/:blogId/comments', function(req, res, next){
});

// Create new comment
router.post('/:blogId/comments', async function(req, res, next){
    const {comment, like, comment_by_id} = req.body
    const id = req.params.blogId
    try{
        const [rows, fields] = await pool.query("INSERT INTO comments (`blog_id`, `comment`, `like`, `comment_date`, `comment_by_id`) value(?, ?, ?, CURRENT_TIMESTAMP, ?)", 
        [
            id,
            comment,
            like,
            comment_by_id
          ]);
        // return json ของรายการ blogs
        return res.json({"message":`A new comment is added (ID: ${id})`});
        // return res.json({"message":`A new comment is added (ID: ${rows.insertID})`});
    
      } catch (err) {
        console.log(err)
        return next(err);
      }
});

// Update comment
router.put('/comments/:commentId', async function(req, res, next){
    const {comment, like, comment_date, comment_by_id, blog_id} = req.body
    const id = req.params.commentId
    
    try{
        const [rows, fields] = await pool.query(
            'UPDATE `comments` SET comment = ?, comments.like = ?, comment_date = ?, comment_by_id = ?, blog_id = ? WHERE id = ?;',
            [comment, like, comment_date, comment_by_id, blog_id, id]
        );
        console.log(rows);
        return res.json({
            "message": `Comment ID ${id} is updated.`,
            "comment": {
                "comment": comment,
                "like": like,
                "comment_date": comment_date,
                "comment_by_id":comment_by_id,
                "blog_id": blog_id
              } //ดึงข้อมูล comment ที่เพิ่งถูก update ออกมา และ return ใน response กลับไปด้วย
        });
    }catch(err){
        console.log(err)
        return next(err);
    }
});

// Delete comment
router.delete('/comments/:commentId', async function(req, res, next){
    // const {comment, like, comment_date, comment_by_id, blog_id} = req.body
    const id = req.params.commentId
    try{
        const [rows, fields] = await pool.query(
            'DELETE FROM comments WHERE id = ?',
            [id]
        );
        console.log(rows);
        return res.json({
            "message": `Comment ID ${id} is delete.`,
        });
    }catch(err){
        console.log(err)
        return next(err);
    }
});

// Delete comment
router.put('/comments/addlike/:commentId', async function(req, res, next){
    const {comment, like, comment_date, comment_by_id, blog_id} = req.body
    const id = req.params.commentId
    try{
        const [rows, fields] = await pool.query("SELECT * FROM comments WHERE id = ?", [id]);
        //ข้อมูล blog ที่เลือกจะอยู่ในตัวแปร rows
        console.log('Selected blogs =', rows)
        //สร้างตัวแปรมาเก็บจำนวน like ณ ปัจจุบันของ blog ที่ select มา
        let likeNum = rows[0].like
        console.log('Like num =', likeNum) // console.log() จำนวน Like ออกมาดู
        //เพิ่มจำนวน like ไปอีก 1 ครั้ง
        likeNum += 1
    
        //Update จำนวน Like กลับเข้าไปใน DB
        const [rows2, fields2] = await pool.query("UPDATE `comments` SET comments.like = ? WHERE id = ?", [likeNum, id]);
       //Redirect ไปที่หน้า index เพื่อแสดงข้อมูล
       return res.json({
        "blogId": rows[0].blog_id,
        "commentId": rows[0].comment,
        "likeNum": likeNum //5 คือจำนวน like ของ comment ที่มี id = 20 หลังจาก +1 like แล้ว
    });
      } catch (err) {
        return next(err);
      }
});


exports.router = router