console.log('Script loaded');

class GridLogo {
    constructor() {
        this.grid = document.getElementById('grid');
        this.cells = [];
        this.opacity = 1;
        this.hue = 0;
        this.motion = 0;
        this.bgHue = 200;
        this.time = 0;
        
        this.createGrid();
        this.setupEventListeners();
        this.animate();
    }
    
    createGrid() {
        // Clear existing grid
        this.grid.innerHTML = '';
        this.cells = [];

        // Pattern with correct numbering
        const pattern = [
            [0, 1, 2, 1, 2, 1, 2, 0],  // Row 0 (top row)
            [0, 4, 3, 4, 3, 4, 3, 0],  // Row 1
            [0, 4, 3, 0, 0, 4, 3, 0],  // Row 2
            [0, 1, 2, 1, 2, 1, 2, 0],  // Row 3
            [0, 4, 3, 4, 3, 4, 3, 0],  // Row 4
            [0, 1, 2, 0, 0, 1, 2, 0],  // Row 5
            [0, 1, 2, 0, 0, 1, 2, 0],  // Row 6
            [0, 4, 3, 0, 0, 4, 3, 0]   // Row 7 (bottom row)
        ];

        // Create cells
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const cellType = pattern[row][col];
                if (cellType !== 0) {
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('viewBox', '0 0 100 100');
svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
svg.style.overflow = 'visible';
                    
                    let path;
                    // In the switch statement, update the paths to:
                    switch(cellType) {
                        case 1: // top-right
                        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', 'M100,0 A100,100 0 0,0 0,100 L100,100 Z');
                        break;
                    case 2: // top-left
                        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', 'M0,0 A100,100 0 0,1 100,100 L0,100 Z');
                        break;
                    case 3: // bottom-right quarter circle with curve bulging toward bottom-right
                        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', 'M0,100 C60,100 100,60 100,0 L0,0 Z');
                        break;
                    case 4: // bottom-left (curving top-left to bottom-right)
                        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', 'M0,0 L100,0 L100,100 A100,100 0 0,1 0,0 Z');
                        break;
                    }
                    
                    path.setAttribute('class', 'quarter-circle');
                    svg.appendChild(path);
                    cell.appendChild(svg);
                }
                
                this.grid.appendChild(cell);
                this.cells.push({
                    element: cell,
                    row,
                    col,
                    type: cellType
                });
            }
        }
        
        this.updateColors();
    }

    setupEventListeners() {
        // Opacity control
        const opacityInput = document.getElementById('opacity');
        const opacityValue = document.getElementById('opacity-value');
        opacityInput.addEventListener('input', (e) => {
            this.opacity = e.target.value / 100;
            opacityValue.textContent = e.target.value;
            this.updateColors();
        });
        
        // Hue control
        const hueInput = document.getElementById('hue');
        const hueValue = document.getElementById('hue-value');
        hueInput.addEventListener('input', (e) => {
            this.hue = parseInt(e.target.value);
            hueValue.textContent = e.target.value;
            this.updateColors();
        });
        
        // Motion control
        const motionInput = document.getElementById('motion');
        const motionValue = document.getElementById('motion-value');
        motionInput.addEventListener('input', (e) => {
            this.motion = e.target.value / 100;
            motionValue.textContent = e.target.value;
        });
        
        // Background hue control
        const bgHueInput = document.getElementById('bgHue');
        const bgHueValue = document.getElementById('bg-hue-value');
        bgHueInput.addEventListener('input', (e) => {
            this.bgHue = parseInt(e.target.value);
            bgHueValue.textContent = e.target.value;
            document.querySelector('.container').style.backgroundColor = `hsl(${this.bgHue}, 30%, 95%)`;
        });
        
        // Set initial background color
        document.querySelector('.container').style.backgroundColor = `hsl(${this.bgHue}, 30%, 95%)`;
    }
    
    updateColors() {
        this.cells.forEach(cell => {
            if (cell.type === 0) return;
            
            const svg = cell.element.querySelector('svg');
            if (!svg) return;
            
            const hue = (this.hue + (cell.row * 10) + (cell.col * 5)) % 360;
            const color = `hsla(${hue}, 80%, 60%, ${this.opacity})`;
            
            const path = svg.querySelector('.quarter-circle');
            if (path) {
                path.style.fill = color;
            }
        });
    }
    
    animate() {
        this.time += 0.02;
        const motionIntensity = this.motion * 5;
        
        this.cells.forEach(cell => {
            if (cell.type === 0) return;
            
            const path = cell.element.querySelector('.quarter-circle');
            if (!path) return;
            
            const offsetX = Math.sin(this.time + cell.row * 0.5 + cell.col * 0.3) * motionIntensity;
            const offsetY = Math.cos(this.time + cell.row * 0.3 + cell.col * 0.5) * motionIntensity;
            
            path.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the grid when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GridLogo();
});