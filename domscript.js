/**
 * Extract the item id from the current URL 
 * @returns the item id as a string
 */
function getItemIdFromUrl() {
    let url = document.URL;
    let itemId = url.slice(url.indexOf("/itm/") + 5).split('?')[0];
    return itemId;
}

/**
 * Extracts the item title, item id and the seller name from the current page
 * @returns an object with field item (title of the item being browsed), seller (seller's username), id (item id)
 */
function parseItem() {
    let itemTitlePrefixLength = 13;
    let itemTitleSelector = "itemTitle";
    let sellerNameSelector = "mbg-nw";
    let itemId = getItemIdFromUrl();
    let itemTitle = document.getElementById(itemTitleSelector).innerText .slice(itemTitlePrefixLength); //Details about   
    let seller = document.getElementsByClassName(sellerNameSelector)[0].innerText;
    return {
        item: itemTitle,
        seller: seller,
        id: itemId
    };
}

parseItem();