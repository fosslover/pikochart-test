var app = new Vue({ 
    el: '#app',
    data () {
        return {
          images: [],
          file: null,
          canvasImages: [],
          canvasTexts: []
        }
      },
    mounted () {
        this.getImages()
    },
    methods: {
        uploadImage() {
            const formData = new FormData();
            formData.append("upload", this.file);
            axios.post('/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            this.getImages()
        },
        getImages(){
            axios
            .get('/images')
            .then(response => (this.images = response.data))
        },
        setSelectedFile(){
            this.file = this.$refs.file.files[0]
        },
        addText(){
            this.canvasTexts.push(`Text Sample ${this.canvasTexts.length + 1}`)
        },
        allowDrop(ev) {
            ev.preventDefault();
        },
          
        drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        },
          
        drop(ev) {
            ev.preventDefault();
            let div;
            let image;
            let span;
            let deleteBtn;
            const data = ev.dataTransfer.getData("text");
            div = document.createElement('div')
            if(!data.toString().includes('http')) {
                span = document.createElement('span')
                const node = document.createTextNode(data);
                span.style = "font-size: 25px; padding: 0 20px; display: inline-block;"
                span.appendChild(node);
                div.appendChild(span)
            } else {
                image = document.createElement('img')
                image.src = data;
                image.style = "width: 100px; height:100px;"
                deleteBtn = document.createElement('button');
                deleteBtn.style = 'position: block; margin-top:20px;padding: 0 15px'
                deleteBtn.onmousedown = "return false"
                btnTxt = document.createTextNode('Delete Me');
                deleteBtn.appendChild(btnTxt);
                deleteBtn.addEventListener('click', function(ev) {
                    console.log('clicked')
                }, true)
                div.append(image, deleteBtn);
            }
            div.style.position = "absolute";
            div.style.left = "0px";
            div.style.top = "0px";
            div.style.width = "100px";
            div.style.height = "100px";
            div.onmousedown = function(event) { // (1) start the process
                // (2) prepare to moving: make absolute and on top by z-index                div.style.zIndex = 1000;
                // move it out of any current parents directly into body
                // to make it positioned relative to the body
                document.body.append(div);
                // ...and put that absolutely positioned div under the pointer
                
                moveAt(event.pageX, event.pageY);
                
                // centers the div at (pageX, pageY) coordinates
                function moveAt(pageX, pageY) {
                    div.style.left = pageX - div.offsetWidth / 2 + 'px';
                    div.style.top = pageY - div.offsetHeight / 2 + 'px';
                }
            
                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                // (3) move the div on mousemove
                document.addEventListener('mousemove', onMouseMove);

                // (4) drop the div, remove unneeded handlers
                div.onmouseup = function() {
                    document.removeEventListener('mousemove', onMouseMove);
                    div.onmouseup = null;
                };
            
            };
            div.ondragstart = function() {
                return false;
            };
            ev.target.appendChild(div);
        },
        deleteElement(ev) {
            const el = ev.target;
            const node = el.parentNode;
            node.parentNode.removeChild(node);
        }
    }
});