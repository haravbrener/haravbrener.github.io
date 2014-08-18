var html5 = false
var filename = window.location.pathname.split('/').pop().split('.')[0]
$(document).ready(function() {
	if ( video = get_id( 'player-inner' )){
		html5 = video.canPlayType && video.canPlayType('video/mp4')=='maybe' && video.canPlayType('audio/mpeg')=='maybe' ? true : false
		set_player()
	}
	if ( get_id( 'library' ))
		set_lib()
	if ( get_id( 'home' ))
		set_home()
		
	$('a.downloader').click( function(){
		$.fileDownload( $(this).prop( 'href' ));
	    return false;
	})

	$('#send-register').click( function() {
		email = $('#input-register').val()
		if (email == '')
			return false
		$('#register').attr('data-problem', 'none')
		if (!/^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
			$('#register').attr('data-problem', 'error')
			return false
		}
		$('#register').attr('data-sending', 1)
		$.post('api/#user_add',{email:email},'json')
		.done(function(){
			$('#register').attr('data-problem', 'success')
			setTimeout(function(){
				window.location = 'index.html'
			}, 3000 )
		})
		.fail(function(){$('#register').attr('data-problem', 'fail')})
		.always(function(){$('#register').attr('data-sending', 0)})
		return false
	})

	$('#send-contact').click(function() {
		msg = $('#input-contact').val()
		if (msg == '')
			return false
		$('#contact').attr('data-problem', 'none')
		$('#contact').attr('data-sending', 1)
		$.post('api/#contact',{msg:msg},'json')
		.done(function(){
			$('#contact').attr('data-problem', 'success')
			setTimeout(function(){
				window.location = 'index.html'
			}, 3000 )
		})
		.fail(function(){$('#contact').attr('data-problem', 'fail')})
		.always(function(){$('#contact').attr('data-sending', 0)})
		return false
	})

})

function set_player() {
	i = data[ filename ]
	url = 'mediafire.com/?'
	document.title = ify(i.title)
	$('#info').append(dtt(i))

	$('#video-size').text(ify(i.video && i.video.Size, '000MB'))
	$('#audio-size').text(ify(i.audio && i.audio.Size, '000MB'))
	$('#container').attr('data-has-video', i.video ? 1 : 0)
	$('#audio-dl-btn').attr('href', 'http://' + url + i.audio.qk )
	$('#player-inner').attr( 'poster', 'http://' + url + i.image.qk )
	if( i.video ){
		$('#video-dl-btn').attr('href', 'http://' + url + i.video.qk )
		$('#av-toggle').click(function(){
			$('#container').attr('data-watch', 1 - $('#container').attr('data-watch'))
			set_media()
		})
	}
	set_media()
}

function set_media() {
	if ( $('#container').attr('data-has-video') == '1' && $('#container').attr('data-watch') == '1' )
		$('#player-inner').attr( html5? 'src' :'href',$('#video-dl-btn').attr('href')).attr('type','video/mp4')
	else
		$('#player-inner').attr( html5? 'src' :'href',$('#audio-dl-btn').attr('href')).attr('type','audio/mpeg')
	if( !html5 )
		flowplayer( 'player-inner', 'flowplayer/flowplayer-3.2.16.swf',  {
		      playlist: [{url:$('#player-inner').attr('poster')+'/poster.jpg',autoPlay:false,autoBuffer:true},{url:$('#player-inner').attr('href')}]})
}

function set_lib() {
	for (i in data )
	$('#library').append($('<a href="' + i + '.html" class="stamp"\/>').append(dtt(data[i])))
}

function set_home() {
	list = ['0118', '0117', '0116', '0115']
	for (i in list )
		$('#latest').append($('<a href="' + list[i] + '.html" class="stamp"\/>').append(dtt(data[list[i]])))
}

function get_id( i ) {
	return document.getElementById( i )
}

function ify(t, alt) {
	return '' + (t || alt || '') + ''
}

function dtt(i) {
	return '<h4>' + ify(i.title) + ' <small>(' + ify(i.Duration, '00:00:00') + ') '+
	(i.audio? '<i class="icon-volume-up" title="אודיו"></i> ' : '') +
	(i.video? '<i class="icon-picture" title="וידיאו"></i> ' : '') +
	(i.doc? '<i class="icon-file-text-alt" title="טקסט"></i> ' : '') +
	'</small></h4>' + '<p>' + ify(i.location) + (i.location ? ', ' : '' ) + ify(i.hebrewdate) + '&nbsp;</p>'
}

