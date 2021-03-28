export const T ={
    x: "x",
    y: 1,
    async f(){
        console.log(this.x);
        console.log(this.y);
        console.log("called F");

    },

    async test(){
        await this.f()
    }
}