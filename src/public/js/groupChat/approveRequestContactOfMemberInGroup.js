function approveRequestContactOfMemberFromGroup(){
  $(".approve-request-contact-sent").off("click").on("click" , function(){
    let targetId = $(this).data("uid");
    $.ajax({
      type: "put",
      url: "/contact/approve-request-contact-from-member-in-group",
      data: {targetId : targetId},
      success: function (data) {
        console.log(data);

        $(`div.groupPanel[data-uid=${targetId}]`).find(".approve-request-contact-sent").remove();
        $(`div.groupPanel[data-uid=${targetId}]`).find(".btn-box").append(`
        <div class="member-talk" data-uid="${targetId}" >
          <span>
            Nhắn tin
          </span>
        </div>
        `)

        let userInforHTML = $("#request-contact-received").find(`li[data-uid = ${targetId}]`);
        $(userInforHTML).find(`div.user-approve-request-contact-received`).remove();
        $(userInforHTML).find(`div.user-remove-request-contact-received`).remove();
        $(userInforHTML).find("div.contactPanel").append(`
        <div class="user-talk" data-uid="${targetId}">
            Trò chuyện
        </div>
        <div class="user-remove-contact action-danger" data-uid="${targetId}">
            Xóa liên hệ
        </div>
        `);

        let userInfofHTML = $(userInforHTML).get(0).outerHTML ;
        
        let user = data.contactInfor ; 

        $("#contacts").find("ul").prepend(userInfofHTML);
        $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();
        decreaseNotificationContact("count-request-contact-received");
        increaseNotificationContact("count-contacts");
        let subUserName = user.username ; 
        if(subUserName.length > 15 ){
          subUserName = subUserName.substr(0,14) + "..."
        }
        let userHTMLLeftSide = `
        <a href="#uid_${user._id}" class="room-chat" data-target="#to_${user._id}">
          <li class="person" data-chat="${user._id}">
              <div class="left-avatar">
                  <div class="dot"></div>
                  <img src="/images/users/${user.avatar}" alt="${user.username}">
              </div>
              <span class="name">
                ${subUserName}
              </span>
              <span class="time"></span>
              <span class="preview convert-emoji"></span>
          </li>
        </a>
        `;

        $("#all-chat").find("ul.people").prepend(userHTMLLeftSide);
        $("#user-chat").find("ul.people").prepend(userHTMLLeftSide);
        $(".left").getNiceScroll().resize();

        let userHTMLRightSide = `
        <div class="right tab-pane" data-chat="${user._id}" id="to_${user._id}">
          <div class="top">
              <span>To: <span class="name">${user.username}</span></span>
              <span class="chat-menu-right">
                  <a href="#attachsModal_${user._id}" class="show-attachs" data-toggle="modal">
                      Tệp đính kèm
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="#imagesModal_${user._id}" class="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
            </div>
            <div class="content-chat">
                <div class="chat convert-emoji" data-chat="${user._id}">
                  
                </div>
            <div class="write convert-emoji" data-chat="${user._id}">
                <input type="text" class="write-chat" id="write-chat-${user._id}" data-chat="${user._id}">
                <div class="icons">
                    <a href="#" class="icon-chat" data-chat="${user._id}"><i class="fa fa-smile-o"></i></a>
                    <label for="image-chat-${user._id}" class="label-image-chat">
                        <input type="file" id="image-chat-${user._id}" name="my-image-chat" class="image-chat" data-chat="${user._id}">
                        <i class="fa fa-photo"></i>
                    </label>
                    <label for="attach-chat-${user._id}" class="label-attachment-chat">
                        <input type="file" id="attach-chat-${user._id}" name="my-attach-chat" class="attach-chat" data-chat="${user._id}">
                        <i class="fa fa-paperclip"></i>
                    </label>
                    <a href="javascript:void(0)" id="video-chat-${user._id}" class="video-chat" data-chat="${user._id}" data-toggle="modal">
                        <i class="fa fa-video-camera"></i>
                    </a>
                  
                </div>
            </div>
        </div>
        `;

        $("#screen-chat").prepend(userHTMLRightSide);
        changeScreenChat() ; 
        convertToImage();

        let userHTMLImageModal = `
        <div class="modal fade" id="imagesModal_${user._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Hình ảnh trong cuộc trò chuyện</h4>
                  </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;">
                        
                      </div>
                  </div>
              </div>
          </div>
        </div>
        `

        $("body").append(userHTMLImageModal) ; 
        gridPhotos(5);

        let userHTMLAttachmentModal = `
        <div class="modal fade" id="attachsModal_${user._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Tệp đính kèm trong cuộc trò chuyện</h4>
                  </div>
                  <div class="modal-body">
                      <ul class="list-attachs">
                          
                      </ul>
                  </div>
              </div>
          </div>
        </div>
        `

        $("body").append(userHTMLAttachmentModal);

        let dataToEmit = {
          contactId : targetId ,
          contactInfor : data.contactInfor
        }
        socket.emit("approve-request-contact-received" , dataToEmit ) ;

        socket.emit("check-status");
        
        chatFromContactList();
        removeContact();
        chatFromGroup();
      }
    });
  })
}

$(document).ready(function () {
  approveRequestContactOfMemberFromGroup();
});