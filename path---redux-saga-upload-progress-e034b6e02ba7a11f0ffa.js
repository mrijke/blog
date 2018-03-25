webpackJsonp([49475531759404],{515:function(n,a){n.exports={data:{site:{siteMetadata:{title:"Random Ramblings",author:"Maarten Rijke"}},markdownRemark:{id:"/home/m/Workspace/blog/src/pages/redux-saga-upload-progress/index.md absPath of file >>> MarkdownRemark",html:'<p><a href="https://redux-saga.js.org">redux-saga</a> is great. It allows you to write complex side-effects easily.\nOne of those more advanced features are <a href="https://redux-saga.js.org/docs/advanced/Channels.html">channels</a>, in particular event channels.\nEvent channels allow your saga to listen to events from external sources, for example from a websocket connection or as we will see in this example, a file upload request.</p>\n<hr>\n<p><em>Before reading further, make sure you have at least a basic understanding of redux-saga and its event channels. In addition, these examples will be written in TypeScript, since I like playing on hard difficulty</em> 😉\n<em>Jokes aside — TypeScript is amazing and you will do yourself a favor if you use it for medium-large sized apps. Give it a <a href="https://github.com/Microsoft/TypeScript-React-Starter">try</a>!</em></p>\n<hr>\n<p>In this example, we will work with a fictional media upload API.\nThis API allows the user to upload several kinds of media, but we will start with uploading a Photo. The type definition of a Photo object is as follows:</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript line-numbers"><code class="language-typescript"><span class="token keyword">type</span> PhotoType <span class="token operator">=</span> <span class="token string">"selfie"</span> <span class="token operator">|</span> <span class="token string">"landscape"</span> <span class="token operator">|</span> <span class="token string">"macro"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">interface</span> <span class="token class-name">IPhoto</span> <span class="token punctuation">{</span>\n  title<span class="token punctuation">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>\n  description<span class="token operator">?</span><span class="token punctuation">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>\n  photo_type<span class="token punctuation">:</span> PhotoType<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">interface</span> <span class="token class-name">ICreatePhotoPayload</span> <span class="token keyword">extends</span> <span class="token class-name">IPhoto</span> <span class="token punctuation">{</span>\n  fileobject<span class="token punctuation">:</span> File<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre>\n      </div>\n<p>As you can see, we define two interfaces. One for representing an instance of a Photo, and one for creating a new one, which has a <code class="language-text">File</code> object that represents the file being uploaded.</p>\n<p>Let’s also define how we actually make the request. In this example, we’ll be using <a href="https://github.com/visionmedia/superagent">superagent</a> to handle the AJAX requests. Let’s define our requests for our <code class="language-text">ApiClient</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript line-numbers"><code class="language-typescript"><span class="token keyword">import</span> superagent <span class="token keyword">from</span> superagent<span class="token punctuation">;</span>\n\n<span class="token keyword">interface</span> <span class="token class-name">IWithFilePayload</span> <span class="token punctuation">{</span>\n  fileobject<span class="token punctuation">:</span> File<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">export</span> <span class="token keyword">const</span> requests <span class="token operator">=</span> <span class="token punctuation">{</span>\n  uploadWithFile<span class="token punctuation">:</span> <span class="token punctuation">(</span>url<span class="token punctuation">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> payload<span class="token punctuation">:</span> IWithFilePayload<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> req <span class="token operator">=</span> superagent\n      <span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`/api/v1/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>url<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">`</span></span><span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token function">attach</span><span class="token punctuation">(</span><span class="token string">"fileobject"</span><span class="token punctuation">,</span> payload<span class="token punctuation">.</span>fileobject<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> payload<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> value <span class="token operator">=</span> payload<span class="token punctuation">[</span>key <span class="token keyword">as</span> keyof <span class="token keyword">typeof</span> payload<span class="token punctuation">]</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>key <span class="token operator">!==</span> <span class="token string">"fileobject"</span> <span class="token operator">&amp;&amp;</span> value <span class="token operator">!==</span> undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        req<span class="token punctuation">.</span><span class="token function">field</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">return</span> req<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre>\n      </div>\n<p>In this example our <code class="language-text">requests</code> object has one function, <code class="language-text">uploadWithFile</code>, which accepts a URL and a payload of type <code class="language-text">IWithFilePayload</code>. This function creates a <code class="language-text">superagent</code> request and attaches the <code class="language-text">fileobject</code> from the payload. Additionally, all other key/value pairs are added as <code class="language-text">field</code>s. Note that this results in a request with <code class="language-text">Content-Type: multipart/form-data</code>.</p>\n<p>Since <code class="language-text">ICreatePhotoPayload</code> matches <code class="language-text">IWithFilePayload</code>, we can use it to create a <code class="language-text">Photo</code> specific sub-object to our <code class="language-text">ApiClient</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript line-numbers"><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> requests <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./index"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">const</span> ApiClient <span class="token operator">=</span> <span class="token punctuation">{</span>\n  Photo<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    create<span class="token punctuation">:</span> <span class="token punctuation">(</span>payload<span class="token punctuation">:</span> ICreatePhotoPayload<span class="token punctuation">)</span> <span class="token operator">=></span>\n      requests<span class="token punctuation">.</span><span class="token function">uploadWithFile</span><span class="token punctuation">(</span><span class="token string">"content/photos/"</span><span class="token punctuation">,</span> payload<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre>\n      </div>\n<p>Now we have an <code class="language-text">ApiClient</code> that can create photos by calling: <code class="language-text">ApiClient.Photo.create(payload)</code>! This will make a <code class="language-text">POST</code> request to our imaginary API at <code class="language-text">/api/v1/content/photos/</code>.</p>\n<p>For the Redux part, we’ll be using the wonderful <a href="https://github.com/aikoven/typescript-fsa">typescript-fsa</a> package. This allows us to easily create the required actions for creating a new Photo:</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript line-numbers"><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> actionCreatorFactory <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"typescript-fsa"</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> ICreatePhotoPayload<span class="token punctuation">,</span> IPhoto <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./Photo"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> factory <span class="token operator">=</span> <span class="token function">actionCreatorFactory</span><span class="token punctuation">(</span><span class="token string">"PHOTOS"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> performCreatePhoto <span class="token operator">=</span> factory<span class="token operator">&lt;</span>ICreatePhotoPayload<span class="token operator">></span><span class="token punctuation">(</span><span class="token string">"PERFORM_CREATE_PHOTO"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> createPhoto <span class="token operator">=</span> factory<span class="token punctuation">.</span><span class="token keyword">async</span><span class="token operator">&lt;</span>ICreatePhotoPayload<span class="token punctuation">,</span> IPhoto<span class="token punctuation">,</span> Error<span class="token operator">></span><span class="token punctuation">(</span>\n  <span class="token string">"CREATE_PHOTO"</span>\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre>\n      </div>\n<p>If you are unfamiliar with <a href="https://github.com/aikoven/typescript-fsa">typescript-fsa</a>, I recommend checking it out. What you need to know for now is that this creates <em>4</em> actions:</p>\n<ol>\n<li><code class="language-text">performCreatePhoto (PHOTOS/PERFORM_CREATE_PHOTO)</code>: This action is the initial trigger for the create photo request. It will be dispatched by a form (which is outside of the scope of this post)</li>\n<li><code class="language-text">createPhoto.started (PHOTOS/CREATE_PHOTO_STARTED)</code>: This action is dispatched by the saga that handles the upload request. It indicates the beginning of the request.</li>\n<li><code class="language-text">createPhoto.failed (PHOTOS/CREATE_PHOTO_FAILED)</code>: This action is dispatched by the saga in case the request failed.</li>\n<li><code class="language-text">createPhoto.done (PHOTOS/CREATE_PHOTO_DONE)</code>: This action is dispatched by the saga when the request has successfully completed.</li>\n</ol>\n<p>Now that we have some actions, we can create the sagas. First, we will create the watcher saga, which will <code class="language-text">takeEvery</code> <code class="language-text">performCreatePhoto</code> action. Then, it will <code class="language-text">call</code> the worker saga, which is the saga actually responsible for the requests:</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript line-numbers"><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> call<span class="token punctuation">,</span> takeLatest<span class="token punctuation">,</span> put <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"redux-saga/effects"</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> createPhoto<span class="token punctuation">,</span> CreatePhotoAction <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./actions"</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token punctuation">{</span> ApiClient <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./ApiClient"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span><span class="token operator">*</span> <span class="token function">performCreatePhotoWatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">yield</span> <span class="token function">takeLatest</span><span class="token punctuation">(</span>performCreate<span class="token punctuation">,</span> performCreatePhotoWorker<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span><span class="token operator">*</span> <span class="token function">performCreatePhotoWorker</span><span class="token punctuation">(</span>action<span class="token punctuation">:</span> CreatePhotoAction<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// indicate that we start the request</span>\n  <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span>createPhoto<span class="token punctuation">.</span><span class="token function">started</span><span class="token punctuation">(</span>action<span class="token punctuation">.</span>payload<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// invoke the request</span>\n  <span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">yield</span> <span class="token function">call</span><span class="token punctuation">(</span>ApiClient<span class="token punctuation">.</span>Photo<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>action<span class="token punctuation">.</span>payload<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// if we end up here the request went all good</span>\n    <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span>createPhoto<span class="token punctuation">.</span><span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">{</span> result<span class="token punctuation">,</span> params<span class="token punctuation">:</span> action<span class="token punctuation">.</span>payload <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// if not, we have to dispatch the failed action</span>\n    <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span>createPhoto<span class="token punctuation">.</span><span class="token function">failed</span><span class="token punctuation">(</span><span class="token punctuation">{</span> error<span class="token punctuation">,</span> params<span class="token punctuation">:</span> action<span class="token punctuation">.</span>payload <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre>\n      </div>\n<p>So far so good - pretty vanilla redux-saga stuff. Now it’s time to add some progress in there!</p>\n<hr>\n<h2>Making progress</h2>\n<p>You might be wondering where is the actual progress tracking going on? Let’s add that now!</p>\n<p>The approach will be to create a redux-saga <code class="language-text">eventChannel</code> to communicate the progress, result and/or error back to the saga.\nWe can pass our <a href="https://github.com/visionmedia/superagent">superagent</a> an event handler to handle the progress events. Let’s look at our changed <code class="language-text">requests</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript line-numbers"><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> eventChannel<span class="token punctuation">,</span> buffers<span class="token punctuation">,</span> END<span class="token punctuation">,</span> Channel <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"redux-saga"</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> _throttle <span class="token keyword">from</span> <span class="token string">"lodash-es/throttle"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">const</span> requests <span class="token operator">=</span> <span class="token punctuation">{</span>\n  uploadWithFile<span class="token punctuation">:</span> <span class="token punctuation">(</span>url<span class="token punctuation">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> payload<span class="token punctuation">:</span> IWithFilePayload<span class="token punctuation">)</span><span class="token punctuation">:</span> Channel<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token function">eventChannel</span><span class="token punctuation">(</span>emitter <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> <span class="token function-variable function">onProgress</span> <span class="token operator">=</span> <span class="token punctuation">(</span>e<span class="token punctuation">:</span> ProgressEvent<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>e<span class="token punctuation">.</span>lengthComputable<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword">const</span> progress <span class="token operator">=</span> e<span class="token punctuation">.</span>loaded <span class="token operator">/</span> e<span class="token punctuation">.</span>total<span class="token punctuation">;</span>\n          <span class="token function">emitter</span><span class="token punctuation">(</span><span class="token punctuation">{</span> progress <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">;</span>\n      <span class="token keyword">const</span> req <span class="token operator">=</span> superagent\n        <span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`/api/v1/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>url<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">`</span></span><span class="token punctuation">)</span>\n        <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"progress"</span><span class="token punctuation">,</span> <span class="token function">_throttle</span><span class="token punctuation">(</span>onProgress<span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n        <span class="token punctuation">.</span><span class="token function">attach</span><span class="token punctuation">(</span><span class="token string">"fileobject"</span><span class="token punctuation">,</span> payload<span class="token punctuation">.</span>fileobject<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> payload<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> value <span class="token operator">=</span> payload<span class="token punctuation">[</span>key <span class="token keyword">as</span> keyof <span class="token keyword">typeof</span> payload<span class="token punctuation">]</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>key <span class="token operator">!==</span> <span class="token string">"fileobject"</span> <span class="token operator">&amp;&amp;</span> value <span class="token operator">!==</span> undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          req<span class="token punctuation">.</span><span class="token function">field</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n      req<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>\n        res <span class="token operator">=></span> <span class="token punctuation">{</span>\n          <span class="token function">emitter</span><span class="token punctuation">(</span><span class="token punctuation">{</span> result<span class="token punctuation">:</span> res<span class="token punctuation">.</span>body <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n          <span class="token function">emitter</span><span class="token punctuation">(</span>END<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        err <span class="token operator">=></span> <span class="token punctuation">{</span>\n          <span class="token function">emitter</span><span class="token punctuation">(</span><span class="token punctuation">{</span> error<span class="token punctuation">:</span> err <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n          <span class="token function">emitter</span><span class="token punctuation">(</span>END<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n      <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n        req<span class="token punctuation">.</span><span class="token function">abort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> buffers<span class="token punctuation">.</span><span class="token function">sliding</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre>\n      </div>\n<p>Quite a few changes! Let’s dive deeper into them:</p>\n<ul>\n<li>Instead of returning the <code class="language-text">superagent</code> request, we’re returning the result of the <code class="language-text">eventChannel</code> function from <code class="language-text">redux-saga</code>. This function takes a callback with one argument, the <code class="language-text">emitter</code>. This <code class="language-text">emitter</code> can be used to emit events back to the saga.</li>\n<li>Next, we create a <code class="language-text">onProgress</code> callback which accepts a <code class="language-text">ProgressEvent</code>. If the percent completion can be determined, we use the <code class="language-text">emitter</code> to emit a progress event, with shape <code class="language-text">{ progress: number }</code>.</li>\n<li>Then, we pass this <code class="language-text">onProgress</code> callback to the <code class="language-text">superagent</code> request via <code class="language-text">.on(&quot;progress&quot;)</code>. For good measure we throw in a Lodash <code class="language-text">throttle</code> so that the callback is only called once every 500ms.</li>\n<li>Since we are now returning the event channel instead of the promise, we have to resolve it ourselves. This is done pretty straight-forwardly by calling <code class="language-text">.then()</code> on the request and passing both the success and error handler. On success, we emit the response body as result, and on error we emit the error. Additionally in both cases we emit the special <code class="language-text">END</code> token afterwards. This signals to the saga that the channel has ended and won’t emit any further events. We will see later in the saga code how that is handled.</li>\n<li>We must return an unsubscribe function, which the saga might call in case early termination is desired. For our case, we can simply call <code class="language-text">.abort()</code> on the request to kill it.</li>\n<li>Finally, we’re using a sliding buffer of 2. This buffers up to 2 events which is OK for this use case since losing a progress update is not the end of the world.</li>\n</ul>\n<p>Before we get into the new saga code, we need to add a new action that can be dispatched when a progress event is emitted.</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript line-numbers"><code class="language-typescript"><span class="token keyword">const</span> updateProgress <span class="token operator">=</span> factory<span class="token operator">&lt;</span><span class="token builtin">number</span><span class="token operator">></span><span class="token punctuation">(</span><span class="token string">"UPDATE_PROGRESS"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span aria-hidden="true" class="line-numbers-rows"><span></span></span></code></pre>\n      </div>\n<p>Let’s now take a look at the updated saga code:</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript line-numbers"><code class="language-typescript"><span class="token keyword">function</span><span class="token operator">*</span> <span class="token function">performCreatePhotoWorker</span><span class="token punctuation">(</span>action<span class="token punctuation">:</span> CreatePhotoAction<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span>createPhoto<span class="token punctuation">.</span><span class="token function">started</span><span class="token punctuation">(</span>action<span class="token punctuation">.</span>payload<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// call our API endpoint to create the channel</span>\n  <span class="token keyword">const</span> channel <span class="token operator">=</span> <span class="token keyword">yield</span> <span class="token function">call</span><span class="token punctuation">(</span>ApiClient<span class="token punctuation">.</span>Photo<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>action<span class="token punctuation">.</span>payload<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> <span class="token punctuation">{</span> progress<span class="token punctuation">,</span> result<span class="token punctuation">,</span> error <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">yield</span> <span class="token function">take</span><span class="token punctuation">(</span>channel<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>progress<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span><span class="token function">updateProgress</span><span class="token punctuation">(</span>progress<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>result<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span>createPhoto<span class="token punctuation">.</span><span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">{</span> result<span class="token punctuation">,</span> params<span class="token punctuation">:</span> action<span class="token punctuation">.</span>payload <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span>createPhoto<span class="token punctuation">.</span><span class="token function">failed</span><span class="token punctuation">(</span><span class="token punctuation">{</span> error<span class="token punctuation">,</span> params<span class="token punctuation">:</span> action<span class="token punctuation">.</span>payload <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>\n    <span class="token comment">// done here</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre>\n      </div>\n<p>Let’s have a closer look at the changes:</p>\n<ul>\n<li>Instead of calling the API endpoint inside the <code class="language-text">try</code> block, we do it just above to get the event channel.</li>\n<li>Then, inside a <code class="language-text">try</code> block, we start an infinite loop and <code class="language-text">yield</code> a <code class="language-text">take</code> effect on the channel. This causes the saga to block and wait until an event has been emitted through the channel.</li>\n<li>Once an event has been emitted, we deconstruct it into its three possible values, <code class="language-text">progress</code>, <code class="language-text">result</code> or <code class="language-text">error</code>. In case of <code class="language-text">progress</code>, we dispatch an action that will update our progress. And in case of <code class="language-text">result</code> or <code class="language-text">error</code>, we dispatch their respective actions.</li>\n<li>Whenever the request is done (i.e. either <code class="language-text">result</code> or <code class="language-text">error</code> has been emitted through the channel), the special <code class="language-text">END</code> symbol is emitted. This causes the saga to break from the <code class="language-text">while (true)</code> loop, and land in the <code class="language-text">finally</code> block of the <code class="language-text">try</code>. Here we could do additional post-processing if we wanted - but for now that is not required.</li>\n</ul>\n<p>This looks pretty good - but what if you have multiple endpoints that need to have this behavior? Can we make it more DRY? Stay tuned for the next post to find out!</p>\n<h3>Reading list</h3>\n<ul>\n<li><a href="https://redux-saga.js.org/docs/advanced/Channels.html">redux-saga Channels</a></li>\n<li><a href="https://visionmedia.github.io/superagent/">superagent</a></li>\n<li><a href="https://github.com/aikoven/typescript-fsa">typescript-fsa</a></li>\n<li><a href="https://decembersoft.com/posts/file-upload-progress-with-redux-saga/">File upload progress with redux-saga</a> - initial inspiration for this post</li>\n</ul>',
frontmatter:{title:"Tracking file upload progress with redux-saga event channels & superagent",date:"March 24, 2018"}}},pathContext:{slug:"/redux-saga-upload-progress/",previous:{fields:{slug:"/hello-world/"},frontmatter:{title:"Hello world!"}},next:!1}}}});
//# sourceMappingURL=path---redux-saga-upload-progress-e034b6e02ba7a11f0ffa.js.map