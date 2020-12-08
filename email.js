/* SmtpJS.com - v3.0.0 */
var Email = {
    send(a) {
        return new Promise(function(n) {
            a.nocache = Math.floor(1e6 * Math.random() + 1),
                a.Action = "Send"; var t = JSON.stringify(a);
            Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, e => n(e));
        });
    },
    ajaxPost(e, n, t) {
        var a = Email.createCORSRequest("POST", e);
        a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
            a.onload = function() {
                var e = a.responseText;
                null != t && t(e);
            },
            a.send(n);
    },
    ajax(e, n) {
        var t = Email.createCORSRequest("GET", e);
        t.onload = function() {
            var e = t.responseText;
            null != n && n(e);
        },
            t.send();
    },
    createCORSRequest(e, n) {
        var t = new XMLHttpRequest();
        return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t;
    }
};

$('[name="file"]').on("change", function() {
    $("#file-log").text(this.files[0].name);
});

$("#contact form").on("submit", async e => {
    const data = new FormData(e.target);
    Email.send({
        SecureToken: "6190c6c7-d390-42fe-b14e-20a1af7f1217",
        To: "wrobel@programmer.net",
        From: data.get("name") + ` <${data.get("email")}>`,
        Subject: data.get("subject"),
        Body: $("textarea").html(),
        Attachments: [{
            name: data.get("file").name,
            path: URL.createObjectURL(data.get("file"))
        }]
    }).then(message => {
        Swal.fire("", message, message === "OK" ? "success" : "error");
    });
});