//历史记录路由
const express = require('express');
const router = express.Router();
const db = require('../config/db');

//获取历史记录
//get用来获取数据
//第一个参数是路由，第二个参数是处理函数
//router.get接受两个参数，第一个是路由，第二个是处理函数
//路由的意思是请求的地址
router.get('/api/history', async (req, res) => {
    try {
        // 先测试数据库连接
        const connection = await db.getConnection();
        // console.log('路由中数据库连接成功');
        
        // 执行查询
        const [rows] = await connection.query(
            'SELECT * FROM converter_history ORDER BY id DESC'
        );
        // console.log('查询结果:', rows);
        
        // 释放连接
        connection.release();
        
        // 返回结果
        res.json(rows);
    } catch (err) {
        // console.error('获取历史记录失败:', err);
        res.status(500).json({ 
            error: 'Failed to fetch history',
            details: err.message 
        });
    }
});

//添加历史记录
router.post('/api/history', async (req, res) => {
    // console.log('收到POST请求:', req.body);
    const { input, output, algorithm } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO converter_history
            (input_value,input_base,output_value,output_base,algorithm)
            VALUES (?,?,?,?,?)`,
            [input.value, input.base, output.value, output.base, algorithm]
        );
        // console.log('插入结果:', result);

        const [newRecord] = await db.query(
            'SELECT * FROM converter_history WHERE id = ?',
            [result.insertId]
        );
        // console.log('新记录:', newRecord);
        res.status(201).json(newRecord[0]);
    } catch (err) {
        // console.error('数据库错误:', err);
        res.status(500).json({
            error: 'Failed to add history',
            details: err.message
        });
    }
});

//清空历史记录
router.delete('/api/history', async (req,res) => {
    try {
        await db.query('TRUNCATE TABLE converter_history');
        res.json({message: 'History cleared successfully'});
    } catch (err) {
        res.status(500).json({ error: 'Failed to clear history' });
    }
});

//导出路由
module.exports = router;

