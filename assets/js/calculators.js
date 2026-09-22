document.addEventListener('DOMContentLoaded', () => {
    // EMI CALCULATOR
    const calcEmiBtn = document.getElementById('calculateEmiBtn');
    if (calcEmiBtn) {
        calcEmiBtn.addEventListener('click', () => {
            const p = parseFloat(document.getElementById('loanAmount').value);
            const r = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
            const n = parseFloat(document.getElementById('loanTenure').value) * 12;

            if (p && r && n) {
                const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                const totalPayment = emi * n;
                const totalInterest = totalPayment - p;

                // Using generic currency format or just numbers, sticking to simple format
                document.getElementById('emiResult').textContent = emi.toFixed(2);
                document.getElementById('totalInterestResult').textContent = totalInterest.toFixed(2);
                document.getElementById('totalPaymentResult').textContent = totalPayment.toFixed(2);
            }
        });
        calcEmiBtn.click(); // calculate default
    }

    // AGE CALCULATOR
    const calcAgeBtn = document.getElementById('calcAgeBtn');
    if (calcAgeBtn) {
        calcAgeBtn.addEventListener('click', () => {
            const dob = new Date(document.getElementById('dobInput').value);
            if (isNaN(dob.getTime())) return;

            const today = new Date();
            let years = today.getFullYear() - dob.getFullYear();
            let months = today.getMonth() - dob.getMonth();
            let days = today.getDate() - dob.getDate();

            if (days < 0) {
                months--;
                days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            document.getElementById('ageResultBox').style.display = 'block';
            document.getElementById('ageResult').textContent = `${years} Years, ${months} Months, ${days} Days`;

            // Detail calculations
            const diffTime = Math.abs(today - dob);
            const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const totalMonths = years * 12 + months;

            document.getElementById('ageDetails').textContent = `or ${totalMonths} total months, or ${totalDays} total days.`;
        });
    }
});
