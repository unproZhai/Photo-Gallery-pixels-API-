const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav--list');

burger.addEventListener('click', e => {
  burger.dataset.state === 'closed' ? burger.dataset.state = "open" : burger.dataset.state = "closed";
  nav.dataset.state === "closed" ? nav.dataset.state = "open" : nav.dataset.state = "closed";
});


class PhotoGallery{
  constructor(){
    this.API_KEY = '563492ad6f9170000100000173e2617e337c415ab3c048adaa5d1ad8';
    this.galleryDIv = document.querySelector('.gallery');
    this.searchForm = document.querySelector('.header form');
    this.loadPrevious = document.querySelector('.load-previous');
    this.loadMore = document.querySelector('.load-more');
    this.logo = document.querySelector('.logo')
    this.pageIndex = 1;
    this.searchValueGlobal = '';
    this.eventHandle();
  }
  eventHandle(){
    document.addEventListener('DOMContentLoaded',()=>{
      this.getImg(1);
    });
    this.searchForm.addEventListener('submit', (e)=>{
      this.pageIndex = 1;
      this.getSearchedImages(e);
    });
    this.loadMore.addEventListener('click', (e)=>{
      this.loadMoreImages(e);
    })
    this.loadPrevious.addEventListener('click', (e)=>{
      this.loadPreviousImages(e);
    })
    this.logo.addEventListener('click',()=>{
      this.pageIndex = 1;
      this.galleryDIv.innerHTML = '';
      this.getImg(this.pageIndex);
    })
  }
  async getImg(index){
    this.loadMore.setAttribute('data-img', 'curated');
    this.loadPrevious.setAttribute('data-img', 'curated');
    const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=10`;
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos)
    // console.log(data)
  }
  async fetchImages(baseURL){
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: this.API_KEY
      }
    });
    const data = await response.json();
    // console.log(data);
    return data;
  }
  GenerateHTML(photos){
  	this.galleryDIv.innerHTML = '';
    photos.forEach(photo=>{
      const item= document.createElement('div');
      item.classList.add('item');
      item.innerHTML = `
      <a href='${photo.src.original}' target="_blank">
        <img src="${photo.src.medium}">
        <h3>${photo.photographer}</h3>
      </a>
      `;
      // console.log(this.galleryDIv)
      this.galleryDIv.appendChild(item)
    })
  }
  async getSearchedImages(e){
    this.loadMore.setAttribute('data-img', 'search');
    this.loadPrevious.setAttribute('data-img', 'search');
    e.preventDefault();
    this.galleryDIv.innerHTML='';
    const searchValue = e.target.querySelector('input').value;
    this.searchValueGlobal = searchValue;
    const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=10`
    const data = await this.fetchImages(baseURL);
    this.GenerateHTML(data.photos);
    e.target.reset();
  }
  async getMoreSearchedImages(index){
    // console.log(searchValue)
    const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=10`
    const data = await this.fetchImages(baseURL);
    // console.log(data)
    this.GenerateHTML(data.photos);
  }
  loadMoreImages(e){
    let index = ++this.pageIndex;
    const loadMoreData = e.target.getAttribute('data-img');
    if(loadMoreData === 'curated'){
      // load next page for curated]
      this.getImg(index)
    }else{
      // load next page for search
      this.getMoreSearchedImages(index);
    }
  }
  loadPreviousImages(e){
    let index = 1;
    (this.pageIndex <= 1) ? index = 1 : index = --this.pageIndex;
    const loadPreviousData = e.target.getAttribute('data-img');
    if(loadPreviousData === 'curated'){
      // load previous page for curated]
      this.getImg(index)
    }else{
      // load previous page for search
      this.getMoreSearchedImages(index);
    }
  }
}

const gallery = new PhotoGallery;