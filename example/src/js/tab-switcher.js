/* Simple Tab Switcher
   expects a structure like:
    <div row class="tabs">
      <a href="#" id="tab_general" class="active">General</a>
      <a href="#" id="tab_details">Details</a>
    <div>
    <div id="tab_general_content" class="active">
    ...
    </div>
    <div id="tab_details_content">
    ...
    </div>
 */

window.contentTabs = function () {

    const switchTab = function (event) {
        const selectedTab = event.target.closest('a');
        for (let tab of selectedTab.parentNode.children) {
            tab.classList.remove('active');
            document.getElementById(tab.id + '_content').classList.remove('active');
        }
        selectedTab.classList.add('active');
        document.getElementById(selectedTab.id + '_content').classList.add('active');
        event.preventDefault();
    };

    for (let container of document.getElementsByClassName('tabs')) {
        for (let tab of container.children) {
            tab.onclick = switchTab;
        }
    }
};
