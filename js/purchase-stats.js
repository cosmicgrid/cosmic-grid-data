// Purchase Statistics for Galactic Grid
// This script handles visualization and processing of in-app purchases data from RevenueCat

// Initialize purchase stats module
const PurchaseStats = {
    // RevenueCat product IDs
    productIds: {
        hints5: 'cosmic_gtid_hints_pack_5',
        hints25: 'cosmic_gtid_hints_pack_25',
        hints50: 'cosmic_gtid_hints_pack_50'
    },
    
    // Product details
    products: {
        'cosmic_gtid_hints_pack_5': {
            title: '5 Hints',
            description: 'Basic hint package',
            price: '$2.99',
            hintCount: 5,
            color: '#4CAF50' // Green
        },
        'cosmic_gtid_hints_pack_25': {
            title: '25 Hints',
            description: 'Popular hint package',
            price: '$6.99',
            hintCount: 25,
            isPopular: true,
            color: '#FF9800' // Orange
        },
        'cosmic_gtid_hints_pack_50': {
            title: '50 Hints',
            description: 'Value hint package',
            price: '$9.99',
            hintCount: 50,
            color: '#2196F3' // Blue
        }
    },
    
    // Mock purchase data - this would be fetched from a backend API in production
    purchaseData: {
        totalRevenue: 0,
        purchaseCounts: {
            'cosmic_gtid_hints_pack_5': 0,
            'cosmic_gtid_hints_pack_25': 0,
            'cosmic_gtid_hints_pack_50': 0
        },
        recentPurchases: [],
        monthlyRevenue: {
            'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0, 
            'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
        }
    },
    
    // Initialize the purchase stats dashboard
    init: function() {
        // Fetch real data in production
        this.mockData();
        
        // Only initialize if the dashboard element exists on the page
        if (document.getElementById('purchase-dashboard')) {
            this.renderDashboard();
            this.setupEventListeners();
        }
    },
    
    // In a real app, this would be an API call to your backend which would fetch data from RevenueCat
    mockData: function() {
        // Generate random purchase data for demonstration
        this.purchaseData.purchaseCounts = {
            'cosmic_gtid_hints_pack_5': Math.floor(Math.random() * 100) + 50,
            'cosmic_gtid_hints_pack_25': Math.floor(Math.random() * 200) + 100,
            'cosmic_gtid_hints_pack_50': Math.floor(Math.random() * 80) + 20
        };
        
        // Calculate total revenue
        let totalRevenue = 0;
        totalRevenue += this.purchaseData.purchaseCounts['cosmic_gtid_hints_pack_5'] * 2.99;
        totalRevenue += this.purchaseData.purchaseCounts['cosmic_gtid_hints_pack_25'] * 6.99;
        totalRevenue += this.purchaseData.purchaseCounts['cosmic_gtid_hints_pack_50'] * 9.99;
        this.purchaseData.totalRevenue = totalRevenue.toFixed(2);
        
        // Generate monthly revenue data
        const months = Object.keys(this.purchaseData.monthlyRevenue);
        months.forEach(month => {
            this.purchaseData.monthlyRevenue[month] = (Math.random() * (totalRevenue / 6)).toFixed(2);
        });
        
        // Generate recent purchases
        this.purchaseData.recentPurchases = [];
        const productIds = Object.keys(this.products);
        
        for (let i = 0; i < 10; i++) {
            const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];
            const daysAgo = Math.floor(Math.random() * 7);
            const purchase = {
                productId: randomProductId,
                date: this.getDateString(daysAgo),
                userId: `user_${Math.floor(Math.random() * 1000)}`,
                price: this.products[randomProductId].price
            };
            this.purchaseData.recentPurchases.push(purchase);
        }
        
        // Sort recent purchases by date
        this.purchaseData.recentPurchases.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
    },
    
    // Helper to get a date string for days ago
    getDateString: function(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split('T')[0];
    },
    
    // Render the dashboard
    renderDashboard: function() {
        const dashboard = document.getElementById('purchase-dashboard');
        if (!dashboard) return;
        
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h2>In-App Purchase Statistics</h2>
                <p>Hint packages purchase data powered by RevenueCat</p>
            </div>
            
            <div class="dashboard-summary">
                <div class="summary-card">
                    <h3>Total Revenue</h3>
                    <p class="revenue">$${this.purchaseData.totalRevenue}</p>
                </div>
                <div class="summary-card">
                    <h3>Total Purchases</h3>
                    <p class="purchases">${this.getTotalPurchases()}</p>
                </div>
                <div class="summary-card">
                    <h3>Most Popular</h3>
                    <p class="popular">${this.getMostPopularPackage()}</p>
                </div>
            </div>
            
            <div class="dashboard-charts">
                <div class="chart-container">
                    <h3>Purchase Distribution</h3>
                    <canvas id="purchase-distribution-chart"></canvas>
                </div>
                <div class="chart-container">
                    <h3>Monthly Revenue</h3>
                    <canvas id="monthly-revenue-chart"></canvas>
                </div>
            </div>
            
            <div class="recent-purchases">
                <h3>Recent Purchases</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Package</th>
                            <th>User ID</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.getRecentPurchasesHTML()}
                    </tbody>
                </table>
            </div>
        `;
        
        // If Chart.js is loaded, render charts
        if (typeof Chart !== 'undefined') {
            this.renderCharts();
        } else {
            console.error('Chart.js is not loaded. Charts will not be rendered.');
        }
    },
    
    // Get total purchases count
    getTotalPurchases: function() {
        return Object.values(this.purchaseData.purchaseCounts).reduce((a, b) => a + b, 0);
    },
    
    // Get the most popular package
    getMostPopularPackage: function() {
        const counts = this.purchaseData.purchaseCounts;
        let maxCount = 0;
        let popularPackage = '';
        
        Object.keys(counts).forEach(productId => {
            if (counts[productId] > maxCount) {
                maxCount = counts[productId];
                popularPackage = this.products[productId].title;
            }
        });
        
        return popularPackage;
    },
    
    // Generate HTML for recent purchases table
    getRecentPurchasesHTML: function() {
        return this.purchaseData.recentPurchases.map(purchase => {
            return `
                <tr>
                    <td>${purchase.date}</td>
                    <td>${this.products[purchase.productId].title}</td>
                    <td>${purchase.userId}</td>
                    <td>${purchase.price}</td>
                </tr>
            `;
        }).join('');
    },
    
    // Render charts using Chart.js (would need to include Chart.js in the HTML)
    renderCharts: function() {
        // Purchase Distribution Chart
        const distributionCtx = document.getElementById('purchase-distribution-chart').getContext('2d');
        const distributionData = {
            labels: Object.values(this.products).map(product => product.title),
            datasets: [{
                label: 'Purchases',
                data: Object.keys(this.products).map(productId => this.purchaseData.purchaseCounts[productId]),
                backgroundColor: Object.values(this.products).map(product => product.color),
                borderWidth: 1
            }]
        };
        
        new Chart(distributionCtx, {
            type: 'doughnut',
            data: distributionData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Hint Package Purchases'
                    }
                }
            }
        });
        
        // Monthly Revenue Chart
        const revenueCtx = document.getElementById('monthly-revenue-chart').getContext('2d');
        const revenueData = {
            labels: Object.keys(this.purchaseData.monthlyRevenue),
            datasets: [{
                label: 'Revenue ($)',
                data: Object.values(this.purchaseData.monthlyRevenue),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };
        
        new Chart(revenueCtx, {
            type: 'bar',
            data: revenueData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Revenue ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    }
                }
            }
        });
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Example: refresh data button
        const refreshButton = document.getElementById('refresh-data');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                this.mockData();
                this.renderDashboard();
            });
        }
    }
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    PurchaseStats.init();
}); 