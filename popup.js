document.addEventListener("DOMContentLoaded", function () {
    const sqlInput = document.getElementById("sql-input");
    const sqlOutput = document.getElementById("sql-output");
    const formatBtn = document.getElementById("format-btn");
    const validateBtn = document.getElementById("validate-btn");
    const copyBtn = document.getElementById("copy-btn");
    const errorMessage = document.getElementById("error-message");

    // Function to check SQL syntax validity
    function isSQLValid(query) {
        query = query.trim();

        // Basic SQL structure check
        const sqlPattern = /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH)\s+[\s\S]+\s+(FROM|INTO|SET|VALUES|WHERE|TABLE|JOIN|ORDER BY|GROUP BY|HAVING)\s+[\s\S]+/i;
        if (!sqlPattern.test(query)) {
            return false;
        }

        // Check for balanced parentheses
        let stack = [];
        for (let char of query) {
            if (char === "(") stack.push(char);
            if (char === ")") {
                if (stack.length === 0) return false; // Unmatched closing parenthesis
                stack.pop();
            }
        }
        if (stack.length !== 0) return false; // Unmatched opening parenthesis

        return true;
    }

    // Format SQL query
    formatBtn.addEventListener("click", function () {
        try {
            const formattedSQL = sqlFormatter.format(sqlInput.value);
            sqlOutput.value = formattedSQL;
            errorMessage.textContent = "";
        } catch (error) {
            errorMessage.textContent = "❌ Formatting error!";
            errorMessage.style.color = "red";
        }
    });

    // Validate SQL syntax
    validateBtn.addEventListener("click", function () {
        if (isSQLValid(sqlInput.value)) {
            sqlInput.classList.remove("invalid");
            sqlInput.classList.add("valid");
            errorMessage.textContent = "✅ Valid SQL Syntax";
            errorMessage.style.color = "green";
        } else {
            sqlInput.classList.remove("valid");
            sqlInput.classList.add("invalid");
            errorMessage.textContent = "❌ Invalid SQL Syntax";
            errorMessage.style.color = "red";
        }
    });

    // Copy to Clipboard
    copyBtn.addEventListener("click", function () {
        sqlOutput.select();
        document.execCommand("copy");
        errorMessage.textContent = "📋 Copied!";
        errorMessage.style.color = "blue";
    });

    // add new code

    // Get the download button
    const downloadBtn = document.createElement("button");
    downloadBtn.id = "download-btn";
    downloadBtn.textContent = "Download SQL";
    downloadBtn.style.width = "100%";
    downloadBtn.style.padding = "10px";
    downloadBtn.style.margin = "6px 0";
    downloadBtn.style.background = "linear-gradient(135deg, #28a745, #218838)";
    downloadBtn.style.color = "white";
    downloadBtn.style.border = "none";
    downloadBtn.style.borderRadius = "6px";
    downloadBtn.style.cursor = "pointer";
    downloadBtn.style.fontSize = "15px";
    downloadBtn.style.fontWeight = "bold";
    downloadBtn.style.textTransform = "uppercase";
    downloadBtn.style.transition = "all 0.3s ease-in-out";
    downloadBtn.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

    // Append the button after the copy button
    copyBtn.insertAdjacentElement("afterend", downloadBtn);

    // Download Functionality
    downloadBtn.addEventListener("click", function () {
        const formattedSQL = sqlOutput.value;

        if (!formattedSQL.trim()) {
            errorMessage.textContent = "❌ No formatted SQL to download!";
            errorMessage.style.color = "red";
            return;
        }

        const blob = new Blob([formattedSQL], {
            type: "text/sql"
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "formatted_query.sql";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        errorMessage.textContent = "✅ SQL file downloaded!";
        errorMessage.style.color = "green";
    });

});