export function lazyLoadImage(imgElement: HTMLImageElement, rootMargin = "0px"){
    if(!("IntersectionObserver" in window)){
        imgElement.src = imgElement.dataset.src || "";
        return
    }

    const observer = new IntersectionObserver(
        (entries, observerInstance)=>{
            entries.forEach((entry)=>{
                if(entry.isIntersecting){
                    const el = entry.target as HTMLImageElement;
                    el.src = el.dataset.src || "";
                    observerInstance.unobserve(el)
                }
            })
        }
    )
    {rootMargin}
};