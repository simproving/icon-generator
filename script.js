class IconGenerator {
    constructor() {
        this.canvas = document.getElementById('iconCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.preview16 = document.getElementById('preview16');
        this.preview48 = document.getElementById('preview48');
        this.preview128 = document.getElementById('preview128');
        
        this.initializeEventListeners();
        this.updateCanvasSize(); // Initialize canvas with correct size first
        this.generateIcon();
    }

    initializeEventListeners() {
        // Input controls
        document.getElementById('iconText').addEventListener('input', () => this.generateIcon());
        document.getElementById('backgroundColor').addEventListener('change', () => this.generateIcon());
        document.getElementById('textColor').addEventListener('change', () => this.generateIcon());
        document.getElementById('shapeType').addEventListener('change', () => this.generateIcon());
        document.getElementById('iconSize').addEventListener('change', () => this.updateCanvasSize());
        document.getElementById('fontFamily').addEventListener('change', () => this.generateIcon());
        document.getElementById('fontSize').addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
            this.generateIcon();
        });

        // Buttons
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadIcon());
    }

    updateCanvasSize() {
        const size = parseInt(document.getElementById('iconSize').value);
        this.canvas.width = size;
        this.canvas.height = size;
        this.generateIcon();
    }

    generateIcon() {
        const text = document.getElementById('iconText').value || 'A';
        const backgroundColor = document.getElementById('backgroundColor').value;
        const textColor = document.getElementById('textColor').value;
        const shapeType = document.getElementById('shapeType').value;
        const fontFamily = document.getElementById('fontFamily').value;
        const fontSize = parseInt(document.getElementById('fontSize').value);
        const size = parseInt(document.getElementById('iconSize').value);

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background shape
        this.drawShape(this.ctx, 0, 0, size, size, shapeType, backgroundColor);

        // Draw text
        this.drawText(this.ctx, text, size / 2, size / 2, fontSize, textColor, fontFamily);

        // Update previews
        this.updatePreviews(text, backgroundColor, textColor, shapeType, fontSize, fontFamily);

        // Enable download button
        document.getElementById('downloadBtn').disabled = false;
    }

    drawShape(ctx, x, y, width, height, shapeType, color) {
        ctx.fillStyle = color;
        ctx.beginPath();

        switch (shapeType) {
            case 'circle':
                ctx.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
                break;
            case 'square':
                ctx.rect(x, y, width, height);
                break;
            case 'rounded':
                const radius = Math.min(width, height) * 0.15;
                ctx.roundRect(x, y, width, height, radius);
                break;
            case 'diamond':
                ctx.moveTo(x + width / 2, y);
                ctx.lineTo(x + width, y + height / 2);
                ctx.lineTo(x + width / 2, y + height);
                ctx.lineTo(x, y + height / 2);
                ctx.closePath();
                break;
        }

        ctx.fill();
    }

    drawText(ctx, text, x, y, fontSize, color, fontFamily) {
        ctx.fillStyle = color;
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.fillText(text, x, y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    updatePreviews(text, backgroundColor, textColor, shapeType, fontSize, fontFamily) {
        const previews = [
            { canvas: this.preview16, size: 16 },
            { canvas: this.preview48, size: 48 },
            { canvas: this.preview128, size: 128 }
        ];

        previews.forEach(preview => {
            const ctx = preview.canvas.getContext('2d');
            const size = preview.size;
            const scaledFontSize = Math.max(8, (fontSize * size) / 128);

            // Clear canvas
            ctx.clearRect(0, 0, size, size);

            // Draw shape
            this.drawShape(ctx, 0, 0, size, size, shapeType, backgroundColor);

            // Draw text
            this.drawText(ctx, text, size / 2, size / 2, scaledFontSize, textColor, fontFamily);
        });
    }

    downloadIcon() {
        const size = parseInt(document.getElementById('iconSize').value);
        const text = document.getElementById('iconText').value || 'A';
        
        // Create a temporary canvas with the selected size
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d');

        // Generate icon on temporary canvas
        const backgroundColor = document.getElementById('backgroundColor').value;
        const textColor = document.getElementById('textColor').value;
        const shapeType = document.getElementById('shapeType').value;
        const fontFamily = document.getElementById('fontFamily').value;
        const fontSize = parseInt(document.getElementById('fontSize').value);

        this.drawShape(tempCtx, 0, 0, size, size, shapeType, backgroundColor);
        this.drawText(tempCtx, text, size / 2, size / 2, fontSize, textColor, fontFamily);

        // Download the image
        const link = document.createElement('a');
        link.download = `chrome-icon-${size}x${size}-${text}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new IconGenerator();
});

// Add roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}
