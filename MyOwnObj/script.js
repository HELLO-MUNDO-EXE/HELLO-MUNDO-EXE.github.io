// Constructor for Chevrolet C8 Corvette
function Corvette(model, year, engineType, horsepower, price) {
    this.make = "Chevrolet";
    this.model = model;
    this.year = year;
    this.engineType = engineType;
    this.horsepower = horsepower;
    this.price = price;

    // Display method - returns HTML string
    this.display = function() {
        return `
            <strong>${this.year} ${this.make} ${this.model}</strong><br>
            Engine: ${this.engineType}<br>
            Horsepower: ${this.horsepower} hp<br>
            Price: $${this.price.toLocaleString()}
        `;
    };
}

// Create an array of 5 C8 Corvette objects
const corvettes = [
    new Corvette("Stingray", 2024, "6.2L V8 LT2", 495, 68995),
    new Corvette("Stingray", 2025, "6.2L V8 LT2", 495, 72500),
    new Corvette("Z06",      2024, "5.5L V8 LT6", 670, 112995),
    new Corvette("Z06",      2025, "5.5L V8 LT6", 670, 118000),
    new Corvette("E-Ray",    2025, "6.2L V8 LT2 Hybrid", 655, 108995)
];

// Function to render all cars (now sorted by price low → high)
function renderCars() {
    const garage = document.getElementById('garage');
    garage.innerHTML = '';

    // Sort a copy of the array by price (ascending)
    const sortedCorvettes = [...corvettes].sort((a, b) => a.price - b.price);

    sortedCorvettes.forEach((car) => {
        const card = document.createElement('div');
        card.className = 'car-card';
        
        card.innerHTML = `
            <h2>Chevrolet C8 Corvette</h2>
            <div style="padding: 15px; line-height: 1.6;">
                ${car.display()}
            </div>
        `;
        
        garage.appendChild(card);
    });
}

// Run when page loads
window.onload = renderCars;