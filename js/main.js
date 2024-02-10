document.addEventListener("DOMContentLoaded", function() {
	const slidesData = [
			// Ваши объекты данных слайдов
			{
				beforeImg: './img/before.png',
				afterImg: './img/after.png',
				title: 'Dodge Challenger',
				review: 'Exceptional service from Mile High Mobile Detailing! I couldn\'t be happier with the incredible transformation of my vehicle. My car looks and feels like it just rolled out of the showroom. I\'ll definitely be returning for future detailing needs!',
				reviewer: '- John Smith, Dec 2023'
		},
		{
				beforeImg: './img/before.png',
				afterImg: './img/after.png',
				title: 'Ford Mustang',
				review: 'The attention to detail on my Mustang was phenomenal. Mile High Detailing really brought back the showroom shine.',
				reviewer: '- Jane Doe, Jan 2024'
		},
		{
				beforeImg: './img/before.png',
				afterImg: './img/after.png',
				title: 'Chevrolet Camaro',
				review: 'Absolutely amazed by the quality of work done on my Camaro. It looks brand new again thanks to Mile High Detailing.',
				reviewer: '- Mike Ross, Feb 2024'
		}
	];

	let currentIndex = 0;

	function createSlideHTML(slide, index) {
			const isActive = index === currentIndex;
			const paginationDots = slidesData.map((_, i) => 
					`<span class="dot ${i === currentIndex ? 'active' : ''}" onclick="jumpToSlide(${i})"></span>`
			).join('');

			return `
					<div class="review__li" style="display: ${isActive ? 'grid' : 'none'};">
							<div class="sl-container">
									<div class="view view-after">
											<img src="${slide.afterImg}" alt="After"/>
									</div>
									<div class="view view-before">
											<img src="${slide.beforeImg}" alt="Before"/>
									</div>
									<div class="dragme">
											<div class="dr-circle dr-circle-top"></div>
											<div class="dr-circle dr-circle-bottom"></div>
									</div>
							</div>
							<div class="sl-text">
									<div class="sl-body">
											<h2>${slide.title}</h2>
											<p class="text">${slide.review}</p>
											<span class="text">${slide.reviewer}</span>
									</div>
									<div class="slider-nav">
											<button class="prev" onclick="changeSlide(-1)">
												<svg width="21" height="38" viewBox="0 0 21 38" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M19.3999 37L1.7999 19.4L19.3999 1.80005" stroke="#919191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
											</button>
											<div class="slider-pagination">${paginationDots}</div>
											<button class="next" onclick="changeSlide(1)">
												<svg width="21" height="38" viewBox="0 0 21 38" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M1.6001 37L19.2001 19.4L1.6001 1.80005" stroke="#919191" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
											</button>
									</div>
							</div>
					</div>`;
	}

	function renderSlides() {
			const reviewList = document.querySelector('.review__list');
			reviewList.innerHTML = slidesData.map((slide, index) => createSlideHTML(slide, index)).join('');

			// Инициализация функциональности "before/after" для каждого слайда после их добавления в DOM
			slidesData.forEach((_, index) => {
					if (index === currentIndex) {
							initBeforeAfterSlider();
					}
			});
	}

	window.changeSlide = function(step) {
			currentIndex = (currentIndex + step + slidesData.length) % slidesData.length;
			renderSlides(); // Re-render slides to update visibility and active dot
	};

	window.jumpToSlide = function(index) {
			currentIndex = index;
			renderSlides(); // Re-render slides to update visibility and active dot
	};

	function initBeforeAfterSlider() {
			// Поскольку слайды уже в DOM, теперь этот селектор найдет элементы
			const dragMe = document.querySelector(".review__li:not([style*='display: none']) .dragme"),
						container = document.querySelector(".review__li:not([style*='display: none']) .sl-container"),
						viewAfter = document.querySelector(".review__li:not([style*='display: none']) .view-after");

			let startX, startLeft, isTouchDevice;

			const draggable = {
					startDrag: function(e) {
							isTouchDevice = e.type.includes('touch');
							var clientX = isTouchDevice ? e.touches[0].clientX : e.clientX;
							startX = clientX;
							startLeft = parseInt(window.getComputedStyle(dragMe).left, 10);
							if (isTouchDevice) {
									document.addEventListener('touchmove', draggable.moveDrag);
									document.addEventListener('touchend', draggable.endDrag);
							} else {
									document.addEventListener('mousemove', draggable.moveDrag);
									document.addEventListener('mouseup', draggable.endDrag);
							}
					},
					moveDrag: function(e) {
							var clientX = isTouchDevice ? e.touches[0].clientX : e.clientX;
							var newPos = startLeft + clientX - startX;
							var containerWidth = container.offsetWidth;
							if (newPos >= 0 && newPos <= containerWidth) {
									dragMe.style.left = newPos + 'px';
									viewAfter.style.width = newPos + 'px';
							}
					},
					endDrag: function() {
							if (isTouchDevice) {
									document.removeEventListener('touchmove', draggable.moveDrag);
									document.removeEventListener('touchend', draggable.endDrag);
							} else {
									document.removeEventListener('mousemove', draggable.moveDrag);
									document.removeEventListener('mouseup', draggable.endDrag);
							}
					}
			};

			if (dragMe) {
					dragMe.addEventListener('mousedown', draggable.startDrag);
					dragMe.addEventListener('touchstart', draggable.startDrag);
			}
	}

	renderSlides();
});
