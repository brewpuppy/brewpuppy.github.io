$.getJSON("/data/bjcp-style-data/json/style-data.min.json", function(json) {

    $.each(json, function() {

        $.each(this, function() {
            if (this.subcategory) {
                var number = this.number;
                $.each(this.subcategory, function() {
                    addModal((number + this.letter), this.name, generateBody(this));
                });
            }
            else {
                addModal(this.number, this.name, generateBody(this));
            }
        });

    });

});

function generateBody(style) {

    var body = "";

    $.each(style.guidelines, function(key, val) {
        if (key == "Vital Statistics") {
            body += "<h3>Vital Statistics</h3>";
            body += "<dl class=\"dl-horizontal\">";
            $.each(val, function(key, val) {
                body += "<dt>" + key + "</dt>";
                body += "<dd>" + val + "</dd>";
            });
            body += "</dl>";
        }
        else {
            body += "<h3>" + key + "</h3><p>" + val + "</p>";
        }
    });

    var notes = new Array();
    body += "<h3>Commercial Examples</h3>";
    body += "<ul>";
    var ce_note = "";
    $.each(style["Commercial Examples"], function() {
        if (this.name) {
            body += "<li>" + this.name + "</li>";
            if (this.note) {
                notes[notes.length] = this.note;
                body += "<span class=\"text-info\">" + this.note + "</span>";
            }
        }
        else if (this.note) { ce_note = this.note; }
    });
    body += "</ul>";
    if (ce_note != "") { body += "<div class=\"alert alert-info\">" + ce_note + "</div>"; }

    return body;

}

function addModal(id, name, body) {

    $("#modal-catcher").append("<div class=\"modal fade\" id=\"modal-" + id + "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"" + id + "Label\" aria-hidden=\"true\"><div class=\"modal-dialog\">    <div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"" + id + "Label\">"+name+" <small>"+id+"</small></h4></div><div class=\"modal-body\">"+body+"</div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div>");

}