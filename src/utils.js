if (location.href.startsWith("http://")) {
  //location = location.href.replace("http://", "https://");
}

const searchParams = new URLSearchParams(location.search);
const useEssentia = searchParams.get("essentia") !== null;
/** @type {GainNode} */
let gainNode;
/** @type {HTMLAudioElement} */
let audio;

function setupWebsocketConnection(webpageName, onMessage, onConnect) {
  // Create WebSocket connection.
  let socket;

  const createSocket = () => {
    socket = new WebSocket("ws://localhost/");

    socket.addEventListener("open", () => {
      console.log("connection opened");
      send({
        type: "connection",
        webpage: webpageName,
      });
      if (onConnect) {
        onConnect(send);
      }
    });
    socket.addEventListener("message", (event) => {
      //console.log("Message from server ", event.data);
      const message = JSON.parse(event.data);
      onMessage(message);
    });
    socket.addEventListener("close", (event) => {
      console.log("connection closed");
      createSocket();
    });
  };
  createSocket();

  const send = (object) => {
    object.from = webpageName;
    socket.send(JSON.stringify(object));
  };

  return send;
}
function setupBroadcastChannel(webpageName, onMessage, onConnect) {
  let broadcastChannel, send;
  const createBroadcastChannel = () => {
    broadcastChannel = new BroadcastChannel("pink-trombone");
    broadcastChannel.addEventListener("message", (event) => {
      //console.log("Message from peer ", event.data);
      const message = event.data;
      if (message.to && message.to.includes(webpageName)) {
        onMessage(message);
      }
    });
    send = (object) => {
      object.from = webpageName;
      broadcastChannel.postMessage(object);
    };
    if (onConnect) {
      onConnect(send);
    }
  };
  createBroadcastChannel();

  return send;
}
const useWebSockets = false;
/**
 * Resumes the audiocontext when it's suspended after a user clicks
 * @param {string} webpageName the name of the webpage this is called from to identify itself
 * @param {function} onMessage is called when the webpage receives websocket messages from the server
 * @returns {object} a send function to send websocket messages to the server
 */
function setupConnection(webpageName, onMessage, onConnect) {
  let send;

  if (useWebSockets) {
    send = setupWebsocketConnection(...arguments);
  } else {
    send = setupBroadcastChannel(...arguments);
  }

  return { send };
}

/**
 * Resumes the audiocontext when it's suspended after a user clicks
 * @param {AudioContext} audioContext
 */
function autoResumeAudioContext(audioContext) {
  window.audioContext = audioContext;
  const resumeAudioContext = () => {
    console.log(`new audio context state "${audioContext.state}"`);
    if (audioContext.state != "running" && audioContext.state != "closed") {
      document.body.addEventListener("click", () => audioContext?.resume(), {
        once: true,
      });
    }
  };
  audioContext.addEventListener("statechange", (e) => {
    resumeAudioContext();
  });
  audioContext.dispatchEvent(new Event("statechange"));
  //resumeAudioContext();
}

/**
 * Returns throttle function that gets called at most once every interval.
 *
 * @param {function} functionToThrottle
 * @param {number} minimumInterval - Minimal interval between calls (milliseconds).
 * @param {object} optionalContext - If given, bind function to throttle to this context.
 * @returns {function} Throttled function.
 */
function throttle(functionToThrottle, minimumInterval, optionalContext) {
  var lastTime;
  if (optionalContext) {
    functionToThrottle = module.exports.bind(
      functionToThrottle,
      optionalContext
    );
  }
  return function () {
    var time = Date.now();
    var sinceLastTime =
      typeof lastTime === "undefined" ? minimumInterval : time - lastTime;
    if (typeof lastTime === "undefined" || sinceLastTime >= minimumInterval) {
      lastTime = time;
      functionToThrottle.apply(null, arguments);
    }
  };
}

// https://www.dyslexia-reading-well.com/44-phonemes-in-english.html
const phonemes = {

  // CONSONANTS
  t: {
    voiced: true,
    graphemes: ["9"],
    example: "9",
    constrictions: {
        front: {
          index: 31.5,
          diameter: -0.4,
       },
    },
  },
    n: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 31.5,
        diameter: -1.1,
      },
    },
  },
    s: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 31.5,
        diameter: 0.4,
      },
    },
  },
    r: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 31.5,
        diameter: 1.1,
      },
    },
  },
    k: {
    voiced: true,
    graphemes: ["9"],
    example: "9",
    constrictions: 
      {
        front: {
          index: 22.0,
          diameter: -0.4,
        },
      },
  },
    g: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 22.0,
        diameter: -1.1,
      },
    },
  },
    h: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 22.0,
        diameter: 0.4,
      },
    },
  },
    q: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 22.0,
        diameter: 1.1,
      },
    },
  },
    p: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: 
      {
        front: {
          index: 41.0,
          diameter: -0.4,
        },
      },
  },
    m: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 41.0,
        diameter: -1.1,
      },
    },
  },
    f: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 41.0,
        diameter: 0.4,
      },
    },
  },
    w: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 41.0,
        diameter: 1.1,
      },
    },
  },
    d: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: 
      {
        front: {
          index: 36.0,
          diameter: -0.4,
        },
      },
  },
    b: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 36.0,
        diameter: -1.1,
      },
    },
  },
    z: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 36.0,
        diameter: 0.4,
      },
    },
  },
    l: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 36.0,
        diameter: 1.1,
      },
    },
  },
    c: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: 
      {
        front: {
          index: 26.75,
          diameter: -0.4,
        },
      },
  },
    j: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 26.75,
        diameter: -1.1,
      },
    },
  },
    x: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 26.75,
        diameter: 0.4,
      },
    },
  },
    y: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 26.75,
        diameter: 1.1,
      },
    },
  },
    //voiceless
    T: {
    voiced: false,
    graphemes: ["9"],
    example: "9",
    constrictions: {
        front: {
          index: 31.5,
          diameter: -0.4,
       },
    },
   },
    N: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 31.5,
        diameter: -1.1,
      },
    },
  },
    S: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 31.5,
        diameter: 0.4,
      },
    },
  },
    R: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 31.5,
        diameter: 1.1,
      },
    },
  },
    K: {
    voiced: false,
    graphemes: ["9"],
    example: "9",
    constrictions: 
      {
        front: {
          index: 22.0,
          diameter: -0.4,
        },
      },
  },
    G: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 22.0,
        diameter: -1.1,
      },
    },
  },
    H: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 22.0,
        diameter: 0.4,
      },
    },
  },
    Q: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 22.0,
        diameter: 1.1,
      },
    },
  },
    P: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: 
      {
        front: {
          index: 41.0,
          diameter: -0.4,
        },
      },
  },
    M: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 41.0,
        diameter: -1.1,
      },
    },
  },
  F: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 41.0,
        diameter: 0.4,
      },
    },
  },
    W: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 41.0,
        diameter: 1.1,
      },
    },
  },
    D: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: 
      {
        front: {
          index: 36.0,
          diameter: -0.4,
        },
      },
  },
    B: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 36.0,
        diameter: -1.1,
      },
    },
  },
    Z: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 36.0,
        diameter: 0.4,
      },
    },
  },
    L: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 36.0,
        diameter: 1.1,
      },
    },
  },
    C: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: 
      {
        front: {
          index: 26.75,
          diameter: -0.4,
        },
      },
  },
    J: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 26.75,
        diameter: -1.1,
      },
    },
  },
    X: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 26.75,
        diameter: 0.4,
      },
    },
  },
    Y: {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      front: {
        index: 26.75,
        diameter: 1.1,
      },
    },
  },
    //tones
  6: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    holdTime: 0.01,
  //  intensity: 0.01,
    frequency: 160,
  //  constrictions: {
   //   back: {
    //    index: 10.0,
    //    diameter: 2.35,
   //   },
  //  },
  },
  5: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    holdTime: 0.01,
   // intensity: 0.01,
    frequency: 140,
  //  constrictions: {
  //    back: {
   //     index: 5.0,
   //     diameter: 2.35,
  //    },
  //  },
  },
  4: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    holdTime: 0.01,
  //  intensity: 0.01,
    frequency: 120,
  //  constrictions: {
   //   back: {
   //     index: 1.0,
    //    diameter: 2.35,
   //   },
  //  },
   }, 

//drillz

"#": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 41.0,
      diameter: 1.1,
    },
  },{
   front: {
      index: 41.0,
      diameter: -0.4,
    },
},{
   front: {
      index: 41.0,
      diameter: 1.1,
    },
},{
      front: {
      index: 41.0,
      diameter: -0.4,
    },
},{
 front: {
      index: 41.0,
      diameter: 1.1,
    },
  },
  ],},
"[": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 36.0,
      diameter: 1.1,
    },
  },{
   front: {
      index: 36.0,
      diameter: -0.4,
    },
},{
   front: {
      index: 36.0,
      diameter: 1.1,
    },
},{
      front: {
      index: 36.0,
      diameter: -0.4,
    },
},{
 front: {
      index: 36.0,
      diameter: 1.1,
    },
  },
  ],},
"]": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 31.5,
      diameter: 1.1,
    },
  },{
   front: {
      index: 31.5,
      diameter: -0.4,
    },
},{
   front: {
      index: 31.5,
      diameter: 1.1,
    },
},{
      front: {
      index: 31.5,
      diameter: -0.4,
    },
},{
 front: {
      index: 31.5,
      diameter: 1.1,
    },
  },
  ],},
"/": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 26.75,
      diameter: 1.1,
    },
  },{
   front: {
      index: 26.75,
      diameter: -0.4,
    },
},{
   front: {
      index: 26.75,
      diameter: 1.1,
    },
},{
      front: {
      index: 26.75,
      diameter: -0.4,
    },
},{
 front: {
      index: 26.75,
      diameter: 1.1,
    },
  },
  ],},
";": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 22.0,
      diameter: 1.1,
    },
  },{
   front: {
      index: 22.0,
      diameter: -0.4,
    },
},{
   front: {
      index: 22.0,
      diameter: 1.1,
    },
},{
      front: {
      index: 22.0,
      diameter: -0.4,
    },
},{
 front: {
      index: 22.0,
      diameter: 1.1,
    },
  },
  ],},
"~": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 41.0,
      diameter: 1.1,
    },
  },{
   front: {
      index: 41.0,
      diameter: -0.4,
    },
},{
   front: {
      index: 41.0,
      diameter: 1.1,
    },
},{
      front: {
      index: 41.0,
      diameter: -0.4,
    },
},{
 front: {
      index: 41.0,
      diameter: 1.1,
    },
  },
  ],},
"{": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 36.0,
      diameter: 1.1,
    },
  },{
   front: {
      index: 36.0,
      diameter: -0.4,
    },
},{
   front: {
      index: 36.0,
      diameter: 1.1,
    },
},{
      front: {
      index: 36.0,
      diameter: -0.4,
    },
},{
 front: {
      index: 36.0,
      diameter: 1.1,
    },
  },
  ],},
"}": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 31.5,
      diameter: 1.1,
    },
  },{
   front: {
      index: 31.5,
      diameter: -0.4,
    },
},{
   front: {
      index: 31.5,
      diameter: 1.1,
    },
},{
      front: {
      index: 31.5,
      diameter: -0.4,
    },
},{
 front: {
      index: 31.5,
      diameter: 1.1,
    },
  },
  ],},
"?": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 26.75,
      diameter: 1.1,
    },
  },{
   front: {
      index: 26.75,
      diameter: -0.4,
    },
},{
   front: {
      index: 26.75,
      diameter: 1.1,
    },
},{
      front: {
      index: 26.75,
      diameter: -0.4,
    },
},{
 front: {
      index: 26.75,
      diameter: 1.1,
    },
  },
  ],},
":": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 22.0,
      diameter: 1.1,
    },
  },{
   front: {
      index: 22.0,
      diameter: -0.4,
    },
},{
   front: {
      index: 22.0,
      diameter: 1.1,
    },
},{
      front: {
      index: 22.0,
      diameter: -0.4,
    },
},{
 front: {
      index: 22.0,
      diameter: 1.1,
    },
  },
  ],},

 //tosi14
  "": {
  voiced: true,
  graphemes: ["9"],
  example: "9",
  constrictions: {
      front: {
        index: 31.5,
        diameter: 0.1,
     },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.8,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["9"],
  example: "9",
  constrictions: 
    {
      front: {
        index: 21.5,
        diameter: 0.1,
      },
    },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: 0.8,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 41.5,
        diameter: 0.1,
      },
    },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: 0.8,
    },
  },
},
"": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 38.0,
        diameter: 0.1,
      },
    },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: 0.8,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 26.5,
        diameter: 0.1,
      },
    },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: 0.8,
    },
  },
},
  //voiceless
  "": {
  voiced: false,
  graphemes: ["9"],
  example: "9",
  constrictions: {
      front: {
        index: 31.5,
        diameter: 0.1,
     },
  },
 },
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["9"],
  example: "9",
  constrictions: 
    {
      front: {
        index: 21.5,
        diameter: 0.1,
      },
    },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: 0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 41.5,
        diameter: 0.1,
      },
    },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: 0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 38.0,
        diameter: 0.1,
      },
    },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: 0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 26.5,
        diameter: 0.1,
      },
    },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: -0.8,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: 0.4,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: 0.8,
    },
  },
},
  //tones
"": {
  voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.01,
//  intensity: 0.01,
  frequency: 160,
//  constrictions: {
 //   back: {
  //    index: 10.0,
  //    diameter: 2.35,
 //   },
//  },
},
"": {
  voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.01,
 // intensity: 0.01,
  frequency: 140,
//  constrictions: {
//    back: {
 //     index: 5.0,
 //     diameter: 2.35,
//    },
//  },
},
"": {
  voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.01,
//  intensity: 0.01,
  frequency: 120,
//  constrictions: {
 //   back: {
 //     index: 1.0,
  //    diameter: 2.35,
 //   },
//  },
},
  "": {
 // voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.1,
  constrictions: {
    back: {
      index: 4.0,
      diameter: 2.35,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.2,
  intensity: 1.0,
//  constrictions: {
 //   back: {
  //    index: 25.0,
  //    diameter: 5.0,
  //  },
 //       tongue: {
  //    index: 21.0,
 //     diameter: 2.7,
 //   },
//  },
},
 "": {
  voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.2,
 intensity: 0.01,
 // constrictions: {
  //  back: {
  //    index: 8.0,
 //     diameter: 5.0,
 //   },
 //       tongue: {
 //     index: 21.0,
 //     diameter: 2.7,
 //   },
//  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 34.0,
      diameter: 0.8,
    },
  },
{ front: {
      index: 34.0,
      diameter: 0.0,
    },

      back: {
      index: 5.0,
      diameter: 0.0,
    },
},{
      back: {
      index: 5.0,
      diameter: 0.0,
    },
  },
                 {
      front: {
      index: 34.0,
      diameter: 2.0,
    },
  },
  ],
},
  //clicks
    "": {
 // voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
  },
{ 

      back: {
      index: 5.0,
      diameter: 0.0,
    },
  front: {
      index: 41.5,
      diameter: 0.0,
    },
},{
      back: {
      index: 5.0,
      diameter: 0.0,
    },
  },
                 {
      front: {
      index: 41.5,
      diameter: 2.0,
    },
  },
  ],
},
    "": {
//  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
  },
{ 

      back: {
      index: 5.0,
      diameter: 0.0,
    },
  front: {
      index: 38.0,
      diameter: 0.0,
    },
},{
      back: {
      index: 5.0,
      diameter: 0.0,
    },
  },
                 {
      front: {
      index: 38.0,
      diameter: 2.0,
    },
  },
  ],
},
    "": {
 // voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
  },
{ 

      back: {
      index: 5.0,
      diameter: 0.0,
    },
  front: {
      index: 31.5,
      diameter: 0.0,
    },
},{
      back: {
      index: 5.0,
      diameter: 0.0,
    },
  },
                 {
      front: {
      index: 31.5,
      diameter: 2.0,
    },
  },
  ],
},
    "": {
 // voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
  },
{ front: {
      index: 26.5,
      diameter: 0.0,
    },

      back: {
      index: 5.0,
      diameter: 0.0,
    },
},{
      back: {
      index: 5.0,
      diameter: 0.0,
    },
  },
                 {
      front: {
      index: 26.5,
      diameter: 2.0,
    },
  },
  ],
},
    "": {
//  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
  },
{ 

      back: {
      index: 5.0,
      diameter: 0.0,
    },
  front: {
      index: 21.5,
      diameter: 0.0,
    },
},{
      back: {
      index: 5.0,
      diameter: 0.0,
    },
  },
                 {
      front: {
      index: 21.5,
      diameter: 2.0,
    },
  },
  ],
},
  //trills
    "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 41.0,
      diameter: 0.8,
    },
  },{
   front: {
      index: 41.0,
      diameter: 3.0,
    },
},{
   front: {
      index: 41.0,
      diameter: 0.8,
    },
},{
      front: {
      index: 41.0,
      diameter: 3.0,
    },
},{
 front: {
      index: 41.0,
      diameter: 0.8,
    },
  },
  ],
},
    "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    front: {
      index: 31.5,
      diameter: 1.0,
    },
  },{
   front: {
      index: 31.5,
      diameter: 0.5,
    },
},{
   front: {
      index: 31.5,
      diameter: 1.0,
    },
},{
      front: {
      index: 31.5,
      diameter: 0.5,
    },
},{
 front: {
      index: 31.5,
      diameter: 1.0,
    },
  },
  ],
},
    "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: [ {
    back: {
      index: 21.5,
      diameter: 0.8,
    },
  },{
   back: {
      index: 21.5,
      diameter: 3.0,
    },
},{
   back: {
      index: 21.5,
      diameter: 0.8,
    },
},{
      back: {
      index: 21.5,
      diameter: 3.0,
    },
},{
 back: {
      index: 21.5,
      diameter: 0.8,
    },
  },
  ],
},
  //extended
  "": {
  voiced: true,
  graphemes: ["9"],
  example: "9",
  constrictions: 
    {
      back: {
        index: 17.5,
        diameter: 0.0,
      },
    },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    back: {
      index: 17.5,
      diameter: -1.5,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    back: {
      index: 17.5,
      diameter: 0.5,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    back: {
      index: 17.5,
      diameter: 1.0,
    },
  },
},
    "": {
  voiced: true,
  graphemes: ["9"],
  example: "9",
  constrictions: 
    {
      front: {
        index: 29.0,
        diameter: 0.0,
      },
    },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 29.0,
      diameter: -1.5,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 29.0,
      diameter: 0.5,
    },
  },
},
  "": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 29.0,
      diameter: 1.0,
    },
  },
},
  "": {
  voiced: false,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.1,
//  constrictions: {
  //  back: {
    //  index: 5.0,
    //  diameter: 0.0,
   // },
 // },
},
  
  //newarticulations
  
    "ก": { voiced: false, graphemes: ["10"], example: "10", constrictions: { front: { index: 26.5, diameter: 1.0, }, }, },
  
  //coarticulations
"п": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 39.5,
      diameter: 0.0,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"м": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 39.5,
      diameter: -1.5,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"ф": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 39.5,
      diameter: 0.5,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"ш": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 39.5,
      diameter: 1.0,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"т": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.0,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"н": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 31.5,
      diameter: -1.5,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"с": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.5,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"л": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 31.5,
      diameter: 1.0,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"к": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 22.5,
      diameter: 0.0,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"г": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 22.5,
      diameter: -1.5,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"х": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 22.5,
      diameter: 0.5,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},

"ь": {
  graphemes: ["9"],
  example: "9",
  voiced: false,    
  constrictions: {
    front: {
      index: 22.5,
      diameter: 1.0,
    },
    tongue: {
      index: 20.5,
      diameter: 2.78,
    },
  },
},
  //taidam phones
  "ꪔ": {
  voiced: true,
  graphemes: ["9"],
  example: "9",
  constrictions: {
      front: {
        index: 31.5,
        diameter: 0.1,
     },
  },
},
  "ꪘ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: -0.8,
    },
  },
},
  "ꪎ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.4,
    },
  },
},
  "ꪦ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.8,
    },
  },
},
  "ꪀ": {
  voiced: true,
  graphemes: ["9"],
  example: "9",
  constrictions: 
    {
      front: {
        index: 21.5,
        diameter: 0.1,
      },
    },
},
  "ꪈ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: -0.8,
    },
  },
},
  "ꪂ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: 0.4,
    },
  },
},
  "ꪄ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: 0.8,
    },
  },
},
  "ꪜ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 41.5,
        diameter: 0.1,
      },
    },
},
  "ꪢ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: -0.8,
    },
  },
},
  "ꪠ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: 0.4,
    },
  },
},
  "ꪪ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: 0.8,
    },
  },
},
"ꪞ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 38.0,
        diameter: 0.1,
      },
    },
},
  "ꪒ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: -0.8,
    },
  },
},
  "ꪖ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: 0.4,
    },
  },
},
  "ꪨ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: 0.8,
    },
  },
},
  "ꪊ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 26.5,
        diameter: 0.1,
      },
    },
},
  "ꪐ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: -0.8,
    },
  },
},
  "ꪌ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: 0.4,
    },
  },
},
  "ꪤ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: 0.8,
    },
  },
},
  //voiceless
  "ꪕ": {
  voiced: false,
  graphemes: ["9"],
  example: "9",
  constrictions: {
      front: {
        index: 31.5,
        diameter: 0.1,
     },
  },
 },
  "ꪙ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: -0.8,
    },
  },
},
  "ꪏ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.4,
    },
  },
},
  "ꪧ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 31.5,
      diameter: 0.8,
    },
  },
},
  "ꪁ": {
  voiced: false,
  graphemes: ["9"],
  example: "9",
  constrictions: 
    {
      front: {
        index: 21.5,
        diameter: 0.1,
      },
    },
},
  "ꪉ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: -0.8,
    },
  },
},
  "ꪃ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: 0.4,
    },
  },
},
  "ꪅ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 21.5,
      diameter: 0.8,
    },
  },
},
  "ꪝ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 41.5,
        diameter: 0.1,
      },
    },
},
  "ꪣ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: -0.8,
    },
  },
},
  "ꪡ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: 0.4,
    },
  },
},
  "ꪫ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 41.5,
      diameter: 0.8,
    },
  },
},
  "ꪟ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 38.0,
        diameter: 0.1,
      },
    },
},
  "ꪓ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: -0.8,
    },
  },
},
  "ꪗ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: 0.4,
    },
  },
},
  "ꪩ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 38.0,
      diameter: 0.8,
    },
  },
},
  "ꪋ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: 
    {
      front: {
        index: 26.5,
        diameter: 0.1,
      },
    },
},
  "ꪑ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: -0.8,
    },
  },
},
  "ꪍ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: 0.4,
    },
  },
},
  "ꪥ": {
  voiced: false,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    front: {
      index: 26.5,
      diameter: 0.8,
    },
  },
},
  //tones
"꪿": {
  voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.01,
//  intensity: 0.01,
  frequency: 180,
  constrictions: {
    back: {
      index: 10.0,
      diameter: 2.8,
    },
  },
},
"ꫀ": {
  voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.01,
 // intensity: 0.01,
  frequency: 140,
  constrictions: {
   back: {
      index: 5.0,
      diameter: 2.8,
    },
  },
},
"ꫂ": {
  voiced: true,
  graphemes: ["7"],
  example: "7",
  holdTime: 0.01,
//  intensity: 0.01,
  frequency: 100,
  constrictions: {
    back: {
      index: 1.0,
      diameter: 2.8,
    },
  },
},
  //coartcs
  "ꪽ": {
voiced: true,
graphemes: ["10"],
example: "10",
constrictions: {
  back: {
    index: 31.5,
    diameter: 0.8,
  },
},
},
"ꪺ": {
voiced: true,
graphemes: ["10"],
example: "10",
constrictions: {
  back: {
    index: 21.5,
    diameter: 0.8,
  },
},
},
"ꪾ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    back: {
      index: 41.5,
      diameter: 0.8,
    },
  },
},
"ꪸ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    back: {
      index: 38.0,
      diameter: 0.8,
    },
  },
},
"ꪼ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    back: {
      index: 26.5,
      diameter: 0.8,
    },
  },
},
  "꫁": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    back: {
      index: 31.5,
      diameter: 5.0,
    },
   },
  },
    "ꪱ": {
  voiced: true,
  graphemes: ["10"],
  example: "10",
  constrictions: {
    back: {
      index: 48.0,
      diameter: -1.5,
    },
   },
  },
    //coartcs
  7: {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      back: {
        index: 31.5,
        diameter: 1.1,
      },
    },
    },
    "'": {
    voiced: true,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      back: {
        index: 22.0,
        diameter: 1.1,
      },
    },
    },
    v: {
      voiced: true,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 41.0,
          diameter: 1.1,
        },
      },
    },
    2: {
      voiced: true,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 36.0,
          diameter: 1.1,
        },
      },
    },
    8: {
      voiced: true,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 26.75,
          diameter: 1.1,
        },
      },
    },
      "-": {
      voiced: true,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 31.5,
          diameter: 5.0,
        },
       },
      },
        "=": {
      voiced: true,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 256.0,
          diameter: -1.1,
        },
       },
      },
  //aspiratecoartcs
      //coartcs
  "&": {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      back: {
        index: 31.5,
        diameter: 1.1,
      },
    },
    },
    "@": {
    voiced: false,
    graphemes: ["10"],
    example: "10",
    constrictions: {
      back: {
        index: 22.0,
        diameter: 1.1,
      },
    },
    },
    V: {
      voiced: false,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 41.0,
          diameter: 1.1,
        },
      },
    }, //risky definition -------------------------------------------------------------------------
    "|": {
      voiced: false,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 36.0,
          diameter: 1.1,
        },
      },
    },
    "*": {
      voiced: false,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 26.75,
          diameter: 1.1,
        },
      },
    },
      "_": {
      voiced: false,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 10.5,
          diameter: 5.0,
        },
       },
      },
        "+": {
      voiced: false,
      graphemes: ["10"],
      example: "10",
      constrictions: {
        back: {
          index: 256.0,
          diameter: -1.5,
        },
       },
      },

  //westernnotes
"": { voiced: true, graphemes: ["c2"], example: "c2", holdTime: 0.01, frequency: 65.410, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c2s"], example: "c2s", holdTime: 0.01, frequency: 69.300, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d2"], example: "d2", holdTime: 0.01, frequency: 73.420, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d2s"], example: "d2s", holdTime: 0.01, frequency: 77.780, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["e2"], example: "e2", holdTime: 0.01, frequency: 82.410, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f2"], example: "f2", holdTime: 0.01, frequency: 87.310, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f2s"], example: "f2s", holdTime: 0.01, frequency: 92.500, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g2"], example: "g2", holdTime: 0.01, frequency: 98.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g2s"], example: "g2s", holdTime: 0.01, frequency: 103.830, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a2"], example: "a2", holdTime: 0.01, frequency: 110.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a2s"], example: "a2s", holdTime: 0.01, frequency: 116.540, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["b2"], example: "b2", holdTime: 0.01, frequency: 123.470, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c3"], example: "c3", holdTime: 0.01, frequency: 130.810, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c3s"], example: "c3s", holdTime: 0.01, frequency: 138.590, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d3"], example: "d3", holdTime: 0.01, frequency: 146.830, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d3s"], example: "d3s", holdTime: 0.01, frequency: 155.560, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["e3"], example: "e3", holdTime: 0.01, frequency: 164.810, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f3"], example: "f3", holdTime: 0.01, frequency: 174.610, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f3s"], example: "f3s", holdTime: 0.01, frequency: 185.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g3"], example: "g3", holdTime: 0.01, frequency: 196.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g3s"], example: "g3s", holdTime: 0.01, frequency: 207.650, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a3"], example: "a3", holdTime: 0.01, frequency: 220.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a3s"], example: "a3s", holdTime: 0.01, frequency: 233.080, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["b3"], example: "b3", holdTime: 0.01, frequency: 246.940, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c4"], example: "c4", holdTime: 0.01, frequency: 261.630, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c4s"], example: "c4s", holdTime: 0.01, frequency: 277.180, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d4"], example: "d4", holdTime: 0.01, frequency: 293.660, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d4s"], example: "d4s", holdTime: 0.01, frequency: 311.130, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["e4"], example: "e4", holdTime: 0.01, frequency: 329.630, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f4"], example: "f4", holdTime: 0.01, frequency: 349.230, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f4s"], example: "f4s", holdTime: 0.01, frequency: 369.990, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g4"], example: "g4", holdTime: 0.01, frequency: 392.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g4s"], example: "g4s", holdTime: 0.01, frequency: 415.300, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a4"], example: "a4", holdTime: 0.01, frequency: 440.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a4s"], example: "a4s", holdTime: 0.01, frequency: 466.160, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["b4"], example: "b4", holdTime: 0.01, frequency: 493.880, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c5"], example: "c5", holdTime: 0.01, frequency: 523.250, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c5s"], example: "c5s", holdTime: 0.01, frequency: 554.370, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d5"], example: "d5", holdTime: 0.01, frequency: 587.330, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d5s"], example: "d5s", holdTime: 0.01, frequency: 622.250, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["e5"], example: "e5", holdTime: 0.01, frequency: 659.250, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f5"], example: "f5", holdTime: 0.01, frequency: 698.460, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f5s"], example: "f5s", holdTime: 0.01, frequency: 739.990, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g5"], example: "g5", holdTime: 0.01, frequency: 783.990, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g5s"], example: "g5s", holdTime: 0.01, frequency: 830.610, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a5"], example: "a5", holdTime: 0.01, frequency: 880.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a5s"], example: "a5s", holdTime: 0.01, frequency: 932.330, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["b5"], example: "b5", holdTime: 0.01, frequency: 987.770, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c6"], example: "c6", holdTime: 0.01, frequency: 1046.500, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["c6s"], example: "c6s", holdTime: 0.01, frequency: 1108.730, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d6"], example: "d6", holdTime: 0.01, frequency: 1174.660, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["d6s"], example: "d6s", holdTime: 0.01, frequency: 1244.510, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["e6"], example: "e6", holdTime: 0.01, frequency: 1318.510, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f6"], example: "f6", holdTime: 0.01, frequency: 1396.910, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["f6s"], example: "f6s", holdTime: 0.01, frequency: 1479.980, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g6"], example: "g6", holdTime: 0.01, frequency: 1567.980, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["g6s"], example: "g6s", holdTime: 0.01, frequency: 1661.220, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a6"], example: "a6", holdTime: 0.01, frequency: 1760.000, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["a6s"], example: "a6s", holdTime: 0.01, frequency: 1864.660, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },
"": { voiced: true, graphemes: ["b6"], example: "b6", holdTime: 0.01, frequency: 1975.530, constrictions: { back: { index: 1.0, diameter: 2.8, }, }, },

  // VOWELS
   a: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 14,
        diameter: 2.78,
      },
    },
  },
  3: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 27.0,
        diameter: 2.76,
      },
    },
  },
  i: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 29.0,
        diameter: 2.0,
      },
    },
  },
  0: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 16.3,
        diameter: 2.0,
      },
    },
  },
  u: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.6,
        diameter: 2.0,
      },
    },
  },
  e: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 19.5,
        diameter: 3.5,
      },
    },
  },
  o: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 2.0,
      },
    },
  },
  9: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.5,
        diameter: 2.78,
      },
    },
  },
  1: {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 24.8,
        diameter: 2.0,
      },
    },
  },
  //hissrotokupu
     A: {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 14,
        diameter: 2.78,
      },
    },
  },
  "£": {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 27.0,
        diameter: 2.76,
      },
    },
  },
  I: {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 29.0,
        diameter: 2.0,
      },
    },
  },
  ")": {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 16.3,
        diameter: 2.0,
      },
    },
  },
  U: {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.6,
        diameter: 2.0,
      },
    },
  },
  E: {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 19.5,
        diameter: 3.5,
      },
    },
  },
  O: {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 2.0,
      },
    },
  },
  "(": {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.5,
        diameter: 2.78,
      },
    },
  },
  "!": {
    voiced: false,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 24.8,
        diameter: 2.0,
      },
    },
  },
  //cyrillicvowels
      "а": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 14,
        diameter: 2.78,
      },
    },
  },
  "е": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 27.0,
        diameter: 2.76,
      },
    },
  },
  "и": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 29.0,
        diameter: 2.0,
      },
    },
  },
  "о": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 16.3,
        diameter: 2.0,
      },
    },
  },
  "у": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.6,
        diameter: 2.0,
      },
    },
  },
  
  //тосивошелс
    "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 14,
        diameter: 2.78,
      },
    },
  },
  "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 27.0,
        diameter: 2.76,
      },
    },
  },
  "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 29.0,
        diameter: 2.0,
      },
    },
  },
  "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 16.3,
        diameter: 2.0,
      },
    },
  },
  "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.6,
        diameter: 2.0,
      },
    },
  },
  "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 19.5,
        diameter: 3.5,
      },
    },
  },
  "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 2.0,
      },
    },
  },
  "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.5,
        diameter: 2.78,
      },
    },
  },
  "": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 24.8,
        diameter: 2.0,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 2.5,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 19.0,
        diameter: 3.7,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 28.5,
        diameter: 2.2,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
   "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 16.5,
        diameter: 1.7,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 22.5,
        diameter: 1.7,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 2.8,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 1.2,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 20.0,
        diameter: 2.7,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 25.0,
        diameter: 2.5,
      },
      back: {
        index: 8.0,
        diameter: 0.65,
      },
    },
  },
"": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 2.5,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 19.0,
        diameter: 3.7,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 28.5,
        diameter: 2.2,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },
   "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 16.5,
        diameter: 1.7,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 22.5,
        diameter: 1.7,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 2.8,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 1.2,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 20.0,
        diameter: 2.7,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },
  "": {
    graphemes: ["9"],
    example: "9",
    voiced: true,    
    constrictions: {
      tongue: {
        index: 25.0,
        diameter: 2.5,
      },
      back: {
        index: 3.0,
        diameter: 0.65,
      },
    },
  },  
//taiveitvowl
   "ꪰ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 14,
        diameter: 2.78,
      },
    },
  },
  "ꪹ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 27.0,
        diameter: 2.76,
      },
    },
  },
  "ꪲ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 29.0,
        diameter: 2.0,
      },
    },
  },
  "ꪶ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 16.3,
        diameter: 2.0,
      },
    },
  },
  "ꪴ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.6,
        diameter: 2.0,
      },
    },
  },
  "ꪵ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 19.5,
        diameter: 3.5,
      },
    },
  },
  "ꪷ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 12.0,
        diameter: 2.0,
      },
    },
  },
  "ꪻ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 20.5,
        diameter: 2.78,
      },
    },
  },
  "ꪳ": {
    voiced: true,
    graphemes: ["7"],
    example: "7",
    constrictions: {
      tongue: {
        index: 24.8,
        diameter: 2.0,
      },
    },
  },
};

for (const phoneme in phonemes) {
  const phonemeInfo = phonemes[phoneme];
  if ("alternative" in phonemeInfo) {
    const alternative = phonemes[phonemeInfo.alternative];
    alternative.alternative = phoneme;
    phonemeInfo.constrictions = alternative.constrictions;
  }
  phonemeInfo.type = "voiced" in phonemeInfo ? "consonant" : "vowel";

  if (!Array.isArray(phonemeInfo.constrictions)) {
    phonemeInfo.constrictions = [phonemeInfo.constrictions];
  }
}

const getInterpolation = (from, to, value) => {
  return (value - from) / (to - from);
};
const clamp = (value, min = 0, max = 1) => {
  return Math.max(min, Math.min(max, value));
};

// https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js#L47
// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
function inverseLerp(x, y, value) {
  if (x !== y) {
    return (value - x) / (y - x);
  } else {
    return 0;
  }
}

// https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js#L62
// https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}

// https://github.com/aframevr/aframe/blob/f5f2790eca841bf633bdaa0110b0b59d36d7e854/src/utils/index.js#L140
/**
 * Returns debounce function that gets called only once after a set of repeated calls.
 *
 * @param {function} functionToDebounce
 * @param {number} wait - Time to wait for repeated function calls (milliseconds).
 * @param {boolean} immediate - Calls the function immediately regardless of if it should be waiting.
 * @returns {function} Debounced function.
 */
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const alternateIPAs = {

};

for (const alternatePhoneme in alternateIPAs) {
  const phoneme = alternateIPAs[alternatePhoneme];
  phonemes[alternatePhoneme] = phonemes[phoneme];
  if (!phonemes[phoneme].aliases) {
    phonemes[phoneme].aliases = new Set();
  }
  phonemes[phoneme].aliases.add(phoneme);
  phonemes[phoneme].aliases.add(alternatePhoneme);
}

const utterances = [
  {
    name: "pleasure",
    keyframes: [
      {
        time: 0,
        name: "p",
        frequency: 156.8715057373047,
        "tongue.index": 12.899999618530273,
        "tongue.diameter": 2.430000066757202,
        "frontConstriction.index": 40.881263732910156,
        "frontConstriction.diameter": -0.422436386346817,
        tenseness: 0.5045413374900818,
        loudness: 0.8427993655204773,
        intensity: 0,
      },
      {
        time: 0.08958333333333333,
        name: "l",
        frequency: 190.45954805788224,
        "tongue.index": 16.921409606933594,
        "tongue.diameter": 1.9775906801223755,
        "frontConstriction.index": 34.73271560668945,
        "frontConstriction.diameter": 0.774807870388031,
        tenseness: 0.7361269593238831,
        loudness: 0.9262712597846985,
        intensity: 1,
      },
      {
        time: 0.2,
        name: "e",
        frequency: 140.82355356753655,
        "tongue.index": 25.9163875579834,
        "tongue.diameter": 2.715711832046509,
        "frontConstriction.index": 37.73653030395508,
        "frontConstriction.diameter": 2.874277114868164,
        tenseness: 0.7361269593238831,
        loudness: 0.9262712597846985,
        intensity: 1,
      },
      {
        time: 0.35208333333333325,
        name: "s",
        frequency: 102.00469207763672,
        "tongue.index": 23.960628509521484,
        "tongue.diameter": 1.543920636177063,
        "frontConstriction.index": 31.57721519470215,
        "frontConstriction.diameter": 0.3962106704711914,
        tenseness: 0.8181954026222229,
        loudness: 0.9509599804878235,
        intensity: 1,
      },
      {
        time: 0.4833333333333334,
        name: "ure",
        frequency: 82.13327455905124,
        "tongue.index": 12.490761756896973,
        "tongue.diameter": 1.8611775636672974,
        "frontConstriction.index": 28.101966857910156,
        "frontConstriction.diameter": 0.9815574884414673,
        tenseness: 0.6612620949745178,
        loudness: 0.9017650485038757,
        intensity: 0.7,
      },
      {
        time: 0.6812499999999999,
        name: ".",
        frequency: 81.25236574691407,
        "tongue.index": 12.490761756896973,
        "tongue.diameter": 1.8611775636672974,
        "frontConstriction.index": 28.101966857910156,
        "frontConstriction.diameter": 0.9815574884414673,
        tenseness: 0.6612620949745178,
        loudness: 0.9017650485038757,
        intensity: 0,
      },
    ],
  },
];


function deconstructVoiceness(voiceness) {
  const tenseness = 1 - Math.cos(voiceness * Math.PI * 0.5);
  const loudness = Math.pow(tenseness, 0.25);
  return { tenseness, loudness };
}

const phonemeSubstitutions = {

  };

let holdTimes = {
  ˈ: 0.05,
  ˌ: 0.05,
  ".": 1.0,
};
let Voiceness = {
  "1": 0.2,
  "2": 0.0001,
};
let consonantHoldTime = 0.1;
let timeBetweenSubResults = 0.1; // seconds
let spaceTime = 0.1;
let releaseTime = 0.1;
let timeBetweenPhonemes = 0.1; // nqaos ko rua ko isunq ronqon tee masani. fakaqaonqa te kupu natadmaagpwoptadatak ki fakaronqon ki nqaa firinqa
let timeBetweenSubPhonemes = 0.01;
let defaultVoiceness = 0.85; //voicesetting
let defaultVoiceless = 0.15;
const generateKeyframes = (pronunciation) => {
  const keyframes = [];
  Array.from(pronunciation).forEach((phoneme, index) => {
    if (nonPhonemeIPAs.includes(phoneme)) {
      return;
    }

    let offsetTime = 0.05;

    let holdTime = 0;
    let nextPhoneme = pronunciation[index + 1];
    if (nextPhoneme == "ˈ" || nextPhoneme == "ˌ") {
      holdTime = holdTimes[nextPhoneme];
    }

    const { type, voiced, constrictions } = phonemes[phoneme];
    if (type == "consonant") {
      holdTime = consonantHoldTime;
    }

    const _keyframes = [];
    constrictions.forEach((constriction, index) => {
      let name = phoneme;
      if (constrictions.length > 1) {
        name += `(${index})`;
      }

      const keyframe = {
        intensity: 1,
        name,
        timeDelta:
          index == constrictions.length - 1
            ? timeBetweenPhonemes
            : timeBetweenSubPhonemes,
        "frontConstriction.diameter": 5,
        "backConstriction.diameter": 5,
      };

      let voiceness = defaultVoiceness;
      if (type == "consonant") {
        voiceness = voiced ? defaultVoiceness : defaultVoiceless;
      }
      Object.assign(keyframe, deconstructVoiceness(voiceness));

      for (const key in constriction) {
        for (const subKey in constriction[key]) {
          let string = key;
          if (key != "tongue") {
            string += "Constriction";
          }
          string += `.${subKey}`;
          keyframe[string] = constriction[key][subKey];
        }
      }
      _keyframes.push(keyframe);

      const holdKeyframe = Object.assign({}, keyframe);
      holdKeyframe.isHold = true;
      holdKeyframe.timeDelta = holdTime;
      holdKeyframe.name = `${holdKeyframe.name}]`;
      _keyframes.push(holdKeyframe);

      if (index == 0 && type == "consonant" && !voiced) {
        // add keyframe after first to change to voiced
        Object.assign(_keyframes[0], deconstructVoiceness(defaultVoiceness));
        _keyframes[0].intensity = 0;
        const voicedToVoicelessKeyframe = Object.assign({}, _keyframes[0]);
        voicedToVoicelessKeyframe.name = `{${voicedToVoicelessKeyframe.name}`;
        //voicedToVoicelessKeyframe.isHold = false;
        voicedToVoicelessKeyframe.timeDelta = 0.001;
        voicedToVoicelessKeyframe.intensity = 0.8;
        Object.assign(
          voicedToVoicelessKeyframe,
          deconstructVoiceness(defaultVoiceless)
        );
        _keyframes.splice(1, 0, voicedToVoicelessKeyframe);

        // add keyframe after last to change back to voiced
        const voicelessToVoicedKeyframe = Object.assign(
          {},
          _keyframes[_keyframes.length - 1]
        );
        voicelessToVoicedKeyframe.timeDelta = 0.001;
        voicelessToVoicedKeyframe.name = `${voicelessToVoicedKeyframe.name}}`;
        //voicelessToVoicedKeyframe.isHold = false;

        //voicelessToVoicedKeyframe.intensity = 0;
        Object.assign(
          voicelessToVoicedKeyframe,
          deconstructVoiceness(defaultVoiceness)
        );
        _keyframes.push(voicelessToVoicedKeyframe);
      }
    });
    keyframes.push(..._keyframes);
  });
  return keyframes;
};

const RenderKeyframes = (keyframes, time = 0, frequency = 140, speed = 1) => {
  const _keyframes = [];
  keyframes.forEach((keyframe) => {
    const _keyframe = Object.assign({}, keyframe);
    if (_keyframe.timeDelta > 0) {
      time += _keyframe.timeDelta / speed;
      _keyframe.time = time;

      if ("frequency" in keyframe) {
        _keyframe.frequency = keyframe.frequency;
      } else if ("semitones" in keyframe) {
        _keyframe.frequency = 140 * 2 ** (keyframe.semitones / 12);
      } else {
        _keyframe.frequency = frequency;
      }

      delete _keyframe.timeDelta;
      _keyframes.push(_keyframe);
    }
  });
  _keyframes.push({
    name: ".",
    time: time + releaseTime / speed,
    frequency,
    intensity: 0,
  });
  return _keyframes;
};

const nonPhonemeIPAs = ["ˈ", "ˌ", "."];

const getPhonemesAlternativesFromWords = (
  wordsString,
  shouldTrimPronunciation = false
) => {
  const wordsStrings = wordsString.split(" ");
  const wordsPhonemesAlternatives = [];
  const validWordStrings = [];

  wordsStrings.forEach((wordString) => {
    if (wordString.length > 0) {
      let ipas = TextToIPA._IPADict[wordString];
      if (ipas) {
        validWordStrings.push(wordString);
        ipas = ipas.slice();
        if (shouldTrimPronunciation) {
          ipas = ipas.map((ipa) => trimPronunciation(ipa));
        }
        wordsPhonemesAlternatives.push(ipas);
      }
    }
  });

  return { wordsPhonemesAlternatives, validWordStrings };
};

const splitPhonemesIntoSyllables = (_phonemes) => {
  const syllables = [];

  let currentSyllable;

  _phonemes = trimDuplicateAdjacentCharacters(_phonemes);

  _phonemes.split("").forEach((phoneme) => {
    if (phoneme in phonemes) {
      const { type } = phonemes[phoneme];
      const isSemiVowel = semiVowels.includes(phoneme);
      if (
        currentSyllable &&
        currentSyllable.type == type &&
        !isSemiVowel &&
        !currentSyllable.isSemiVowel
      ) {
        currentSyllable.phonemes += phoneme;
      } else {
        currentSyllable = { type, phonemes: phoneme, isSemiVowel };
        syllables.push(currentSyllable);
      }
    }
  });
  return syllables;
};

let semiVowels = [];
//semiVowels.length = 0;

const trimDuplicateAdjacentCharacters = (string) =>
  string
    .replace(" ", "")
    .split("")
    .filter((char, i) => string[i - 1] != char)
    .join("");

const consonantGroups = [

];

const areConsonantsInSameGroup = (a, b) => {
  let consonantsAreInSameGroup = false;
  consonantGroups.some((consonantGroup) => {
    if (consonantGroup.includes(a)) {
      consonantsAreInSameGroup = consonantGroup.includes(b);
      return true;
    }
  });
  return consonantsAreInSameGroup;
};

const tractLengthRange = { min: 15, max: 88 };
const isTractLengthInRange = (tractLength) =>
  tractLength >= tractLengthRange.min && tractLength <= tractLengthRange.max;
