function redirectToLogin() {
  location.assign(escape("index.html"));
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    var userIdentifier = sessionStorage.getItem("user_identifier");
    if (!userIdentifier) {
      alert("Please log in to continue.");
      redirectToLogin();
    }

    var memberContainer = document.getElementById("memberContainer");
    var memberList = [];
    var memberCounter = 0;

    document.getElementById("addMemberBtn").onclick = function () {
      if (memberList.filter(function (x) { return x; }).length >= 5) {
        return alert("Maximum 5 members.");
      }
      var index = memberCounter++;
      var div = document.createElement("div");
      div.className = "member";
      div.innerHTML = '<label>Member ' + (index + 1) + ': <input required></label>' +
        '<label>Email: <input type="email" required></label>' +
        '<label>Phone: <input type="tel" required></label>' +
        '<button type="button">Remove</button><hr>';
      memberContainer.appendChild(div);
      memberList[index] = div;
      div.querySelector("button").onclick = function () {
        div.remove();
        memberList[index] = null;
      };
    };

    function saveTeam(team) {
      return fetch("addTeam.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team)
      }).then(function (res) {
        return res.json();
      });
    }

    function fetchTeams() {
      return fetch("getTeams.php?usuario_id=" + userIdentifier)
        .then(function (res) {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        });
    }

    document.getElementById("submitTeam").onclick = function () {
      var teamName = document.getElementById("teamName").value.trim();
      var managerName = document.getElementById("managerName").value.trim();
      var managerEmail = document.getElementById("managerEmail").value.trim();
      var managerPhone = document.getElementById("managerPhone").value.trim();
      if (!teamName || !managerName || !managerEmail || !managerPhone) {
        return alert("Please fill out all team fields.");
      }
      var members = memberList.filter(function (x) { return x; }).map(function (div) {
        var inputs = div.querySelectorAll("input");
        return {
          name: inputs[0].value.trim(),
          email: inputs[1].value.trim(),
          phone: inputs[2].value.trim()
        };
      });
      if (!members.length) {
        return alert("Add at least one member.");
      }
      var data = {
        usuario_id: +userIdentifier,
        nombreEquipo: teamName,
        nombreManager: managerName,
        email: managerEmail,
        telefono: managerPhone,
        miembros: members
      };
      saveTeam(data).then(function (resp) {
        if (resp.success) {
          alert("Team registered successfully.");
          document.getEl
