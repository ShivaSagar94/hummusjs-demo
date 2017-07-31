var app = require('express')()
var fs = require('fs')
var port = process.env.PORT || 8585

const express = require('express');
var mime = require('mime');

const bodyParser= require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var hummus = require('hummus')
const path = require('path');
app.use("/shared", express.static(path.join(__dirname, 'shared')));


app.get('/', function(req, res) {        
    res.sendFile(__dirname + '/index.html');
});


app.post('/download',function(req,res){            
    var resultPath = './shared/output.pdf';    
    var sourcePath = './shared/example.pdf';
    var logFilePath='./shared/output1.pdf'
        
    if(req.body.type == 'orange'){
        sourcePath = './shared/exampleorange.pdf';
    }        
    var hummus = require('hummus');            
    // var pdfReader = hummus.createReader(sourcePath,{log:logFilePath});
    // pageNumber=pdfReader.getPagesCount()
    var pdfWriter = hummus.createWriterToModify(sourcePath,
                                        {modifiedFilePath:resultPath,log:logFilePath});                
    
    var pageModifier = new hummus.PDFPageModifier(pdfWriter,0,true);        
    var cxt = pageModifier.startContext().getContext();
    cxt.drawCircle(400,400,30,
        {
            type:'fill',
            color:'red',            
        }
    );
    pageModifier.endContext().writePage();

    pdfWriter.end();    
    var file = resultPath;
    var filename = path.basename("Download-annonate.pdf");
    var mimetype = mime.lookup(file);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);

});


app.listen(port, function() {
    console.log('listening on *:' + port);
});
