const getResultInput = (resultInputId, formulaElement) => {
  let resultInput = document.getElementById(resultInputId);

  if (!resultInput) {
    resultInput = document.createElement("input");
    resultInput.id = resultInputId;
    resultInput.readOnly = true;
    resultInput.className = "text-input";
    resultInput.placeholder = `${resultInputId} نتیجه محاسبه`;

    if (formulaElement.parentElement) {
      formulaElement.parentElement.appendChild(resultInput);
    }
  }

  return resultInput;
};

const updateResult = (value, resultInput) => {
  resultInput.value = value;
};

const showInvalid = (resultInput) => {
  updateResult("Invalid Formula", resultInput);
};

const calculate = (variables, formula, resultInput) => {
  const values = {};
  let isValid = true;

  // Validate inputs with strict numeric check
  for (const varName of variables) {
    const input = document.getElementById(varName);
    const val = input.value.trim();

    // Allow: optional sign, numbers with optional decimal, no leading/trailing characters
    if (!/^-?\d*\.?\d+$/.test(val)) {
      isValid = false;
    }
    values[varName] = Number(val);
  }

  if (!isValid) {
    showInvalid(resultInput);
    return;
  }

  try {
    const evaluation = formula.replace(/\b[a-zA-Z_]+\b/g, (match) => {
      if (typeof values[match] !== "number") throw new Error();
      return values[match];
    });

    const result = eval(evaluation);
    if (typeof result === "number" && isFinite(result)) {
      updateResult(result, resultInput);
    } else {
      showInvalid(resultInput);
    }
  } catch (error) {
    showInvalid(resultInput);
  }
};

const formulaSectionHandler = (formulaElement) => {
  const formula = formulaElement.getAttribute("evaluator");
  const variables = [...new Set(formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g))];
  const inputs = variables
    .map((varName) => document.getElementById(varName))
    .filter(Boolean);

  console.log("formulaElement parent", formulaElement.parentElement);

  const resultInput = getResultInput(formula, formulaElement);

  inputs.forEach((input) =>
    input.addEventListener("input", () =>
      calculate(variables, formula, resultInput)
    )
  );
};

document.addEventListener("DOMContentLoaded", function () {
  const formulaElements = document.querySelectorAll("formula");
  if (!formulaElements.length) return;
  formulaElements.forEach((formulaElement) =>
    formulaSectionHandler(formulaElement)
  );
});
