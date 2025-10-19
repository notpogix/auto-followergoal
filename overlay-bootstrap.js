(function() {
  const scriptTag = document.currentScript;
  const command = (scriptTag.getAttribute("data-command") || "!fgoal").toLowerCase();
  const labelText = scriptTag.getAttribute("data-label") || "Followers:";
  const fontFamily = scriptTag.getAttribute("data-font") || "Nunito, sans-serif";
  const fontSize = parseInt(scriptTag.getAttribute("data-size") || "48", 10);
  const fontColor = scriptTag.getAttribute("data-color") || "#ffffff";
  const align = scriptTag.getAttribute("data-align") || "center";
  let goal = parseInt(scriptTag.getAttribute("data-default-goal") || "100", 10);
  let currentFollowers = parseInt(scriptTag.getAttribute("data-start") || "0", 10);

  // Build container
  const container = document.createElement("div");
  container.id = "follower-goal";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = align === "left" ? "flex-start" : (align === "right" ? "flex-end" : "center");
  container.style.fontFamily = fontFamily;
  container.style.fontSize = fontSize + "px";
  container.style.color = fontColor;
  container.style.textShadow = "rgb(0, 0, 0) 1px 1px 1px";
  container.style.whiteSpace = "nowrap";

  const labelSpan = document.createElement("span");
  labelSpan.style.fontWeight = "600";
  labelSpan.style.marginRight = "8px";
  labelSpan.textContent = labelText;

  const valueSpan = document.createElement("span");
  valueSpan.style.fontWeight = "700";
  valueSpan.textContent = `${currentFollowers}/${goal}`;

  container.appendChild(labelSpan);
  container.appendChild(valueSpan);
  document.body.appendChild(container);

  function updateDisplay() {
    valueSpan.textContent = `${currentFollowers}/${goal}`;
  }

  // Listen for events
  window.addEventListener("onEventReceived", function (obj) {
    const listener = obj.detail?.listener;
    const event = obj.detail?.event;

    // New follower event
    if (listener === "follower-latest") {
      currentFollowers++;
      updateDisplay();
    }

    // Chat command to set goal
    if (listener === "message" && event?.data?.text) {
      const text = event.data.text.trim().toLowerCase();
      if (text.startsWith(command)) {
        const parts = text.split(/\s+/);
        const newGoal = parseInt(parts[1], 10);
        if (Number.isFinite(newGoal) && newGoal > 0) {
          goal = newGoal;
          updateDisplay();
        }
      }
    }
  });

  // Initial render
  updateDisplay();
})();
