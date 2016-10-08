
export function maxPropertyValue(salary = 0, cash = 0, lpp = 0, age = 50, gender = "female") {
    // Emprunter maximum 80% de la valeur de la propriété
    var maxBorrow = 0.8;

    // Interet théorique sur l'emprunt
    const interest = 0.05;

    // Amortissement annuel de l'emprunt si le client a moins de 50 ans
    var amortization = 0.0125;

    // Entretien de la propriété: 1% de la valeur totale de la propriété
    const maintenance = 0.01;

    // Age de la retraite
    if (gender === "female") {
        var retirement = 64;
    } else if (gender === "male") {
        var retirement = 65;
    } else {
        // Could use "return;" here, but I'm nice
        var retirement = 64;
    }


    // Frais de notaire: 5%
    const notaryFee = 0.05;

    var array = [];

    if (age >= 51 && age < retirement) {
        amortization = 0.15 / (retirement - age);
    } else if (age >= retirement) {
        maxBorrow = 0.65;
    }

    var salaryLimitedValue = (salary / 3) / (maxBorrow * (interest + amortization) + maintenance);
    array.push(salaryLimitedValue);

    // TODO: Quel est le ratio requis si l'emprunt est de moins de 80% ?
    if (lpp === 0) {
        // Si pas de LPP, le cash doit valoir 25% de la propriété
        var cashLimitedValue1 = cash / (1 - maxBorrow + notaryFee);
        array.push(cashLimitedValue1);
    } else if (lpp > 0) {
        // Si il existe une LPP, le cash doit etre au minimum 15% de la propriété, lpp 10%
        var cashLimitedValue2 = cash / (1 - 0.15);
        array.push(cashLimitedValue2);
        if (lpp < cashLimitedValue2 * 0.1) {
            // Si la LPP n'est pas suffisante, la propriété est limitée par la LPP
            lppLimitedValue = lpp / (1 - 0.10);
            array.push(lppLimitedValue);
        }
    }

    // Return the smallest value of the 5
    var maxValue = Math.min(...array);

    // Round value down to nearest 1000
    return Math.floor(maxValue/1000)*1000;
}
