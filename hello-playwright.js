const { firefox } = require('playwright');

(async () => {
  //Opening Browser
  const browser = await firefox.launch({headless: false});
  
  //Opening Context 
  //Commented paramater can record video of the test (no audio)
  const context = await browser.newContext({/*recordVideo: {dir:'videos'}*/});

  //Opening Page
  const page = await context.newPage();

  //page.evaluate is used to access the AudioContext in the PlayWright Automation
  await page.evaluate(()=>{
    //Functions for Recording
    //startrecording takes in an Audio Context as a parameter
    function startrecording(ctx){
      //Creating a recording stream
      recordingstream = ctx.createMediaStreamDestination();
      //Creating a Media Recorder with the correct stream
      recorder = new MediaRecorder(recordingstream.stream);
      recorder.start();
    }
    function stoprecording(){
      recorder.addEventListener('dataavailable',function(e){
        document.querySelector('#recording').src=URL.createObjectURL(e.data);
        recorder = false;
        recordingstream = false;
      });
      recorder.stop();
    }

    //Creating Constants
    const audioChunks = []
    bufferSize = 4096;

    //Creating Media Stream for speaker
    var speaker = new MediaStream;

    //Creating Audio Context
    const ctx = new AudioContext();

    //Adding audio tracks to stream
//    speaker.addTrack(recorder.stream)

    //Playing Sound
    const osc = ctx.createOscillator(500);
    osc.connect(ctx.destination);
    osc.start();



    //Creating Audio Recording
    const source = ctx.createMediaStreamSource(speaker);
    const processor = ctx.createScriptProcessor(bufferSize, 1, 1);

    //Starting Audio Recording
    startrecording(ctx);
    //const mediaRecorder = new MediaRecorder(stream);

    //Stop Recording    
    stoprecording();

    //const blob = new Blob([wav], {type: 'audio/wav'});
    //const url = URL.createObjectURL(blob);
    //url.click();

    //Testing Log
    //return "End of logtest";
  })
  //Opening test playground
  await page.goto('https://playground.babylonjs.com/#SPLFNK#1');
  console.log("Webpage Loaded");


  //Screenshot
  //await page.screenshot({ path: 'screenshot.png' });

  //Closing Browsers
  await context.close();
  await browser.close();
})();