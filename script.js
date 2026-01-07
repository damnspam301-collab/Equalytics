document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get inputs
    const gender = document.getElementById('gender').value;
    const experience = parseFloat(document.getElementById('experience').value);
    const education = document.getElementById('education').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const location = document.getElementById('location').value;

    // Model parameters (from trained linear regression)
    const intercept = 29845.14563106797;
    const coefficients = [
        5399.999999999999,  // cat__Gender_Male
        -855.6865464632451,  // cat__Education_Level_Master
        -1768.3079056865433, // cat__Education_Level_PhD
        1560.194174757283,   // cat__Job_Title_Consultant
        3015.048543689318,   // cat__Job_Title_Designer
        -522.1220527045795,  // cat__Job_Title_Developer
        -504.1608876560351,  // cat__Job_Title_Director
        5077.045769764211,   // cat__Job_Title_Engineer
        285.15950069347883,  // cat__Job_Title_Intern
        -1492.0249653259325, // cat__Job_Title_Manager
        -1549.3065187239888, // cat__Job_Title_Senior Engineer
        1158.4604715672647,  // cat__Job_Title_VP
        2453.0513176144214,  // cat__Location_Urban
        5484.951456310679    // remainder__Years_Experience
    ];

    // Function to create feature vector
    function getFeatures(gender, education, jobTitle, location, experience) {
        const features = new Array(14).fill(0);

        // Gender_Male (index 0)
        if (gender === 'Male') features[0] = 1;

        // Education (Bachelor base, Master index 1, PhD index 2)
        if (education === 'Master') features[1] = 1;
        else if (education === 'PhD') features[2] = 1;

        // Job_Title (Analyst base, indices 3-11)
        const jobMap = {
            'Consultant': 3,
            'Designer': 4,
            'Developer': 5,
            'Director': 6,
            'Engineer': 7,
            'Intern': 8,
            'Manager': 9,
            'Senior Engineer': 10,
            'VP': 11
        };
        if (jobTitle in jobMap) features[jobMap[jobTitle]] = 1;

        // Location_Urban (index 12)
        if (location === 'Urban') features[12] = 1;

        // Years_Experience (index 13)
        features[13] = experience;

        return features;
    }

    // Predict function
    function predict(features) {
        let salary = intercept;
        for (let i = 0; i < coefficients.length; i++) {
            salary += features[i] * coefficients[i];
        }
        return Math.round(salary);
    }

    // Get prediction for input
    const features = getFeatures(gender, education, jobTitle, location, experience);
    const predictedSalary = predict(features);

    // Get predictions for male and female (for gap analysis)
    const maleFeatures = getFeatures('Male', education, jobTitle, location, experience);
    const femaleFeatures = getFeatures('Female', education, jobTitle, location, experience);
    const maleSalary = predict(maleFeatures);
    const femaleSalary = predict(femaleFeatures);
    const gap = maleSalary - femaleSalary;

    // Display result
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>Predicted Salary for ${gender}: $${predictedSalary}</p>
        <p>Predicted for Male (same inputs): $${maleSalary}</p>
        <p>Predicted for Female (same inputs): $${femaleSalary}</p>
        <p>Potential Pay Gap (Male - Female): $${gap} (Positive indicates male advantage)</p>
        <p>Note: This is a demo based on sample data.</p>
    `;
});