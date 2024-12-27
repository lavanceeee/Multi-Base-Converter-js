class ModalManager {
    constructor() {
        this.modal = document.getElementById('featuresModal');
        this.closeBtn = this.modal.querySelector('.close-btn');
        this.featuresBtn = document.querySelector('.nav-btn[data-section="features"]');
        
        this.init();
    }

    init() {
        // 点击功能说明按钮显示模态框
        this.featuresBtn.addEventListener('click', () => this.showModal());
        
        // 点击关闭按钮隐藏模态框
        this.closeBtn.addEventListener('click', () => this.hideModal());
        
        // 点击模态框外部区域关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hideModal();
            }
        });
    }

    showModal() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    hideModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// 创建模态框管理器实例
window.modalManager = new ModalManager();
