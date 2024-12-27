const express = require('express');
const cors = require('cors');
const historyRoutes = require('./routes/history');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 添加请求日志中间件
app.use((req, res, next) => {
    // console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// 路由
app.use(historyRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
    // console.error('服务器错误:', err);
    res.status(500).json({ 
        error: 'Server error',
        details: err.message 
    });
});

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`服务器运行在端口 ${PORT}`);
// });
