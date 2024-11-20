interface IframeContentOptions {
  styles: string
  cssCode: string
  htmlCode: string
  javascriptCode: string
}

const consoleInterceptor = `
  let errorHandler;
  
  function cleanupEventListeners() {
    if (errorHandler) {
      window.removeEventListener('error', errorHandler);
    }
  }

  errorHandler = function(event) {
    window.parent.postMessage({ 
      type: 'error',
      message: event.message,
      error: {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack || ''
      }
    }, '*');
    return true;
  };

  window.addEventListener('error', errorHandler, true);
  window.addEventListener('unload', cleanupEventListeners);

  const originalConsoleLog = console.log.bind(console);
  const originalConsoleError = console.error.bind(console);
  
  console.log = function(...args) {
    originalConsoleLog(...args);
    
    const processedArgs = args.length === 1 ? processArg(args[0]) : args.map(processArg);
    window.parent.postMessage({ type: 'log', message: processedArgs }, '*');
  };

  console.error = function(...args) {
    originalConsoleError(...args);
    
    const processedArgs = args.length === 1 ? processArg(args[0]) : args.map(processArg);
    window.parent.postMessage({ type: 'error', message: processedArgs }, '*');
  };

  function processArg(arg) {
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number') return arg;
    if (typeof arg === 'boolean') return arg;
    if (typeof arg === 'function') return '[Function: ' + (arg.name || 'anonymous') + ']';
    if (arg instanceof Error) {
      return {
        message: arg.message,
        stack: arg.stack
      };
    }
    if (arg === null) return null;
    if (arg === undefined) return undefined;
    if (typeof arg === 'object') {
      try {
        return JSON.parse(JSON.stringify(arg));
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  }
`

function processJavaScriptCode(code: string): string {
  const cleanedCode = code.replace(/<script.*?>|<\/script>/g, '')
  const importStatements = cleanedCode.match(/import\s+(?:\S.*?)??from\s+['"].*?['"];?/g) || []
  const mainCode = cleanedCode.replace(/import\s+(?:\S.*?)??from\s+['"].*?['"];?/g, '').trim()

  const wrappedCode = `
    let errorHandler = function(msg, url, line, col, error) {
      window.parent.postMessage({ 
        type: 'error',
        message: msg,
        error: { 
          message: msg,
          source: url,
          lineno: line,
          colno: col,
          stack: error?.stack || ''
        }
      }, '*');
      return true;
    };

    window.onerror = errorHandler;

    window.addEventListener('unload', () => {
      window.onerror = null;
    });

    try {
      (async () => {
        ${mainCode}
      })();
    } catch (error) {
      window.parent.postMessage({ 
        type: 'error',
        message: error.message,
        error: { 
          message: error.message,
          stack: error.stack || ''
        }
      }, '*');
    }
  `

  return [...importStatements, wrappedCode].join('\n')
}

export function generateIframeContent(options: IframeContentOptions): string {
  const { styles, cssCode, htmlCode, javascriptCode } = options

  return `
    <!DOCTYPE html>
    <html>
      <head>
        ${styles}
        <style>
          html, body {
            background: none !important;
            color: #fff;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #fff;
          }
        </style>
        <style>${cssCode}</style>
        <script>${consoleInterceptor}<\/script>
        <script type="module">${processJavaScriptCode(javascriptCode)}<\/script>
      </head>
      <body>
        ${htmlCode}
      </body>
    </html>
  `.trim()
}
