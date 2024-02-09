document.addEventListener("DOMContentLoaded", function() {
	var dragMe = document.querySelector(".dragme"),
			container = document.querySelector(".sl-container"),
			viewAfter = document.querySelector(".view-after"),
			startX, startLeft, isTouchDevice;

	var draggable = {
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
							viewAfter.style.width = newPos + 5 + 'px';
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

	dragMe.addEventListener('mousedown', draggable.startDrag);
	dragMe.addEventListener('touchstart', draggable.startDrag);

	container.addEventListener("click", function(event) {
			// Prevent click event on touch devices
			if (event.type === 'touchend') event.preventDefault();
			var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
			var eventLeft = clientX - container.getBoundingClientRect().left - 15;
			animateTo(eventLeft + 'px');
	});

	function animateTo(_left) {
			var targetLeft = typeof _left === 'string' && _left.includes('%') ? container.offsetWidth * parseFloat(_left) / 100 : parseFloat(_left);
			smoothMove(dragMe, targetLeft, 'left');
			smoothMove(viewAfter, targetLeft + 5, 'width');
	}

	function smoothMove(element, target, property) {
			var startPos = parseInt(window.getComputedStyle(element)[property], 10);
			var distance = target - startPos;
			var startTime = new Date().getTime();

			function move() {
					var timeElapsed = new Date().getTime() - startTime;
					var progress = timeElapsed / 600; // 600ms for 'slow' animation
					if (progress < 1) {
							element.style[property] = startPos + (distance * progress) + 'px';
							requestAnimationFrame(move);
					} else {
							element.style[property] = target + 'px';
					}
			}

			requestAnimationFrame(move);
	}
});
