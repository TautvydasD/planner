// Drag and drop utilities
/* eslint-disable */
const setElementPosition = function (el, y) {
  el.style.top = `${y}px`
}

const getRestrictedCoordinates = function (y, bottomBoundary) {
  if (y < -20) y = -20
  if (y > bottomBoundary + 5) y = bottomBoundary + 5
  return y
}

const isNodeAbove = function (firstNode, secondNode) {
  const firstRect = firstNode.getBoundingClientRect()
  const secondRect = secondNode.getBoundingClientRect()
  return (firstRect.top + window.scrollY) + firstRect.height / 2 <
      (secondRect.top + window.scrollY) + secondRect.height / 2
}

const getPlaceholder = function (className, el) {
  const placeholder = el.cloneNode(true)
  placeholder.removeAttribute('style')
  placeholder.id = 'data-row-placeholder'
  placeholder.className = className
  return placeholder
}

const toggleDraggableStyle = function (el, isMouseDown) {
  el.removeAttribute('style')
  el.classList.toggle('data-row-item-draggable')
}

export default parentElement => {
  const dnd = {
    isMouseDown: false,
    dynamicPlaceholder: null,
    draggableObjectParent: null,
    draggablePos: 0,
    targetDataMarginOffset: 0,
    // Data variables
    targetData: null,
    targetIndex: 0,
    scrollableParent: null,
    handleData: () => {}
  }
  const swapNodes = function (firstNode, secondNode) {
    const table = dnd.draggableObjectParent
    const firstSibling = firstNode.nextSibling === secondNode ? firstNode : firstNode.nextSibling
    table.insertBefore(firstNode, secondNode)
    table.insertBefore(secondNode, firstSibling)
  }
  let isScrolling = false
  let interval
  let scrollingDown
  let lastScrollPos
  function scrollFunction () {
    if (scrollingDown) {
      dnd.scrollableParent.scrollTop = dnd.scrollableParent.scrollTop + 4
    } else {
      dnd.scrollableParent.scrollTop = dnd.scrollableParent.scrollTop - 4
    }
  }
  function scroll (scroll) {
    if (scroll && !isScrolling) {
      startScrolling()
    }
    if (!scroll) {
      stopScrolling()
    }
  }
  function startScrolling () {
    isScrolling = true
    interval = setInterval(scrollFunction, 10)
  }
  function stopScrolling () {
    isScrolling = false
    clearInterval(interval)
  }
  function scrollingAction (evt) {
    const parentTop = dnd.scrollableParent.getBoundingClientRect().top
    const parentBottom = dnd.scrollableParent.getBoundingClientRect().bottom
    const currentTop = dnd.targetData.getBoundingClientRect().top
    const currentBottom = dnd.targetData.getBoundingClientRect().bottom
    if (currentTop < parentTop * 1.5) {
      scrollingDown = false
      lastScrollPos = evt.clientY
      scroll(true)
    } else if (currentBottom > parentBottom) {
      scrollingDown = true
      lastScrollPos = evt.clientY
      scroll(true)
    }
    if (scrollingDown && evt.clientY < lastScrollPos) {
      scroll(false)
    } else if (!scrollingDown && evt.clientY > lastScrollPos) {
      scroll(false)
    }
  }
  dnd.getReorderedList = function (dataArray, oldIndex, newIndex) {
    const updatedData = [...dataArray]
    const removedObjects = updatedData.splice(oldIndex, 1)
    updatedData.splice(newIndex, 0, removedObjects[0])
    return updatedData
  }

  dnd.handleStart = function (evt, parameterObject) {
    // Exit drag if already draggin
    if (this.isMouseDown || this.targetData !== null) return
    document.body.style = 'cursor: grabbing;'
    // Set mouse dragging status
    this.isMouseDown = true
    this.targetData = parameterObject.targetData
    this.draggableObjectParent = parentElement || this.targetData.parentNode
    this.targetIndex = Array.prototype.slice
      .call(this.draggableObjectParent.children)
      .indexOf(this.targetData)
    // Set parameters default
    this.handleData = parameterObject.handleData
    this.scrollableParent = parameterObject.scrollableParent || this.draggableObjectParent
    // Set where mouse/finger will follow drag
    this.draggablePos = 10
    this.targetDataMarginOffset = parseInt(getComputedStyle(this.targetData).marginTop)
    // Creates placeholder element
    this.dynamicPlaceholder = getPlaceholder('data-row-item-placeholder row', this.targetData)
    this.targetData.id = 'data-row-item-target'
    // Inserting first placeholder
    const nextSibling = this.targetData.nextElementSibling
    if (nextSibling) this.draggableObjectParent.insertBefore(this.dynamicPlaceholder, nextSibling)
    else this.draggableObjectParent.appendChild(this.dynamicPlaceholder)
    // Table start position from top inside a page
    const tablePosY = this.scrollableParent.getBoundingClientRect().top + window.scrollY
    // Mouse Y position inside drag component parent
    const relativeToTableMouseY = (evt.pageY || evt.changedTouches[0].pageY) -
        tablePosY - this.targetDataMarginOffset - this.draggablePos

    toggleDraggableStyle(this.targetData, this.isMouseDown)
    setElementPosition(this.targetData, relativeToTableMouseY)

    // Setting events ONLY when mouse is down.
    // Mounting these events on elements is unnecessary,
    // because if the user has his mouse/finger on draggable
    // components outside of drag event, redundant calculations
    // will be made, thus reducing performance
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('mousecancel', handleEnd)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
    document.addEventListener('touchcancel', handleEnd)
    // Stops from default mobile scroll
    if (evt.changedTouches) {
      evt.stopImmediatePropagation()
    }
    evt.preventDefault()
  }

  const handleMove = function (evt) {
    // Exit if currently dragging
    if (!dnd.isMouseDown) return
    // scrollingAction only works with scrollable parent div, for full page scroll additional implementation is needed
    scrollingAction(evt)
    // New mouse/finger coordinates
    const tablePosY = dnd.scrollableParent.getBoundingClientRect().top + window.scrollY
    const mouseY = (evt.pageY || evt.changedTouches[0].pageY) -
        tablePosY - dnd.targetDataMarginOffset - dnd.draggablePos

    const newPosY = getRestrictedCoordinates(
      mouseY,
      dnd.draggableObjectParent.clientHeight
    )
    // Set draggable element positon
    setElementPosition(dnd.targetData, newPosY)

    const previousElement = dnd.targetData.previousElementSibling
    const nextElement = dnd.dynamicPlaceholder.nextElementSibling

    if (previousElement && isNodeAbove(dnd.targetData, previousElement)) {
      swapNodes(dnd.dynamicPlaceholder, dnd.targetData)
      swapNodes(dnd.dynamicPlaceholder, previousElement)
    }

    if (nextElement && isNodeAbove(nextElement, dnd.targetData)) {
      swapNodes(nextElement, dnd.dynamicPlaceholder)
      swapNodes(nextElement, dnd.targetData)
    }

    if (evt.changedTouched) {
      evt.stopImmediatePropagation()
    }
    evt.preventDefault()
  }

  const handleEnd = function () {
    if (!dnd.isMouseDown) return
    dnd.isMouseDown = false
    stopScrolling()
    const placeholder = document.getElementById('data-row-placeholder')
    if (placeholder) {
      dnd.draggableObjectParent.removeChild(placeholder)
      if (dnd.handleData) {
        const target = document.getElementById('data-row-item-target')
        dnd.handleData(target, dnd.targetIndex)
      }
    }

    if (dnd.targetData) {
      toggleDraggableStyle(dnd.targetData, dnd.isMouseDown)
      dnd.targetData.removeAttribute('id')
    }

    document.body.style = 'cursor: default;'
    // Reset variables
    dnd.targetIndex = 0
    dnd.targetData = null
    dnd.dynamicPlaceholder = null

    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('mousecancel', handleEnd)
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
    document.removeEventListener('touchcancel', handleEnd)
  }
  return dnd
}
