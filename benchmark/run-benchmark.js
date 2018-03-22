const benchmarks = [
    {
        name: "scrolling 400x800 25px/tick",
        scrollBy: 25,
        max: 5000,
        width: 600,
        height: 960


    },
    {
        name: "scrolling 400x800 50px/tick",
        scrollBy: 50,
        max: 5000,
        width: 600,
        height: 960
    },
    {
        name: "scrolling 400x800 100px/tick",
        scrollBy: 100,
        max: 5000,
        width: 600,
        height: 960
    }


];

define(function(require, exports, module) {
    var ace = require("ace/ace");
    var event = require("ace/lib/event");

    class Benchmark {
        constructor(editor) {
            this.editor = editor;
        }

        run(scrollBy, max = Math.Infinity) {
            let renderer = this.editor.renderer;
            let session = this.editor.session;
            let top = -1;

            session.$scrollTop = -1;
            renderer.scrollTop = -1;
            session.setScrollTop(0);

            return new Promise(function(resolve, reject) {
                renderer.on("afterRender", handler);

                function handler() {
                    if (renderer.scrollTop > max)
                        return resolve();

                    top = renderer.scrollTop;

                    event.nextTick(function() {
                        session.setScrollTop(top + scrollBy);
                    }, 0);
                }
            });
        }
    }

    function prepareEditor() {
        var editor = ace.edit("editor");

        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/javascript");

        var values = Array(100).fill(ace.edit.toString());

        editor.setValue(values.join("\n"));
        return editor;
    }

    var editor = prepareEditor();
    var bench = new Benchmark(editor);

    const init = async() => {
        for (let benchmark of benchmarks) {
            let el = document.querySelector("#editor");

            el.style.width = `${benchmark.width}px`;
            el.style.height = `${benchmark.height}px`;

            let start = window.performance.now();
            console.profile(benchmark.name);
            await bench.run(benchmark.scrollBy, benchmark.max);
            console.profileEnd();
            let end = window.performance.now();
            console.log("Done: %s %s", end - start, benchmark.name);
        }
    };

    init();
});