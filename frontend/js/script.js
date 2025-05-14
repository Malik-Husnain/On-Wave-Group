$(document).ready(function() {
    console.log('Click Fit JS Loaded with jQuery');
    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data && data.text) {
                $('#fact-text').text(data.text);
            } else {
                $('#fact-text').text('Could not retrieve a fact today. Please try again later.');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching fact:', textStatus, errorThrown);
            $('#fact-text').text('Failed to load fitness fact. Check console for details.');
        }
    });
    const dropZone = $('#drop-zone');
    const fileInput = $('#file-input');
    const previewArea = $('#preview-area');
    const uploadButton = $('#upload-button');
    const uploadFeedback = $('#upload-feedback');
    let filesToUpload = []; 
    dropZone.on('click', function() {
        fileInput.click();
    });
    dropZone.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.addClass('hover');
    });

    dropZone.on('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.removeClass('hover');
    });

    dropZone.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.removeClass('hover');
        dropZone.addClass('dropped');
        const droppedFiles = e.originalEvent.dataTransfer.files;
        handleFiles(droppedFiles);
        setTimeout(() => dropZone.removeClass('dropped'), 2000); 
    });
    fileInput.on('change', function() {
        const selectedFiles = this.files;
        handleFiles(selectedFiles);
    });

    function handleFiles(files) {
        uploadFeedback.html(''); 
        if (!files || files.length === 0) {
            uploadFeedback.html('<div class="alert alert-warning">No files selected.</div>');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')){
                uploadFeedback.append('<div class="alert alert-danger">File ' + file.name + ' is not an image.</div>');
                continue;
            }
            if (file.size > 10 * 1024 * 1024) { 
                 uploadFeedback.append('<div class="alert alert-danger">File ' + file.name + ' is too large (max 10MB).</div>');
                continue;
            }
            filesToUpload.push(file);
            previewFile(file);
        }

        if (filesToUpload.length > 0) {
            uploadButton.show();
        } else {
            uploadButton.hide();
        }
    }

    function previewFile(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            const fileId = 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            const imgContainer = $('<div class="img-preview-container"></div>').attr('id', fileId);
            const img = $('<img />').attr('src', reader.result);
            const removeBtn = $('<button class="remove-img-btn">&times;</button>');

            removeBtn.on('click', function() {
                filesToUpload = filesToUpload.filter(f => f !== file);
                $('#' + fileId).remove();
                if (filesToUpload.length === 0) {
                    uploadButton.hide();
                }
            });

            imgContainer.append(img).append(removeBtn);
            previewArea.append(imgContainer);
        }
    }
    uploadButton.on('click', function() {
        if (filesToUpload.length === 0) {
            uploadFeedback.html('<div class="alert alert-info">Please select images to upload.</div>');
            return;
        }

        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append('images', file); 
        });

        uploadFeedback.html('<div class="alert alert-info"><div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div> Uploading...</div>');
        uploadButton.prop('disabled', true);

        $.ajax({
            url: 'http://localhost:3000/upload', 
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                uploadFeedback.html('<div class="alert alert-success">' + response.msg + '</div>');
                if(response.files && response.files.length > 0){
                    response.files.forEach(file => {
                         uploadFeedback.append('<p class="text-success small">Uploaded: ' + file + '</p>');
                    });
                }
                filesToUpload = []; 
                previewArea.empty();
                uploadButton.hide().prop('disabled', false);
                fileInput.val(''); 
            },
            error: function(jqXHR, textStatus, errorThrown) {
                let errorMsg = 'Error uploading files.';
                if (jqXHR.responseJSON && jqXHR.responseJSON.msg) {
                    errorMsg = jqXHR.responseJSON.msg;
                }
                uploadFeedback.html('<div class="alert alert-danger">' + errorMsg + ' Please try again.</div>');
                uploadButton.prop('disabled', false);
            }
        });
    });
    const revealElements = document.querySelectorAll('.data-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});