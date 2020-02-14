<?php
	defined( 'ABSPATH' ) || die( 'Keep Quit' );
?>

<script type="text/html" id="tmpl-woo-variation-gallery-slider-template">
    <# hasVideo = (  data.video_link ) ? 'wvg-gallery-video-slider' : '' #>
    <# thumbnailSrc = (  data.video_link ) ? data.video_thumbnail_src : data.gallery_thumbnail_src #>
    <# videoHeight = ( data.video_height ) ? data.video_height : '100%' #>
    <# videoWidth = ( data.video_width ) ? data.video_width : '100%' #>
    <div class="wvg-gallery-image {{hasVideo}}">

        <# if( data.video_link && data.video_embed_type==='iframe' ){ #>
        <iframe src="{{ data.video_embed_url }}" style="width: {{ videoWidth }}; height: {{videoHeight}}; margin: 0;padding: 0; background-color: #000" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
        <# } #>

        <# if( data.video_link && data.video_embed_type==='video' ){ #>
        <video preload="auto" controls controlsList="nodownload" src="{{ data.video_link }}" style="width: {{videoWidth}}; height: {{videoHeight}}; margin: 0;padding: 0; background-color: #000"></video>
        <# } #>

        <# if( !data.video_link ){ #>
        <div>
            <img width="{{data.src_w}}" height="{{data.src_h}}" src="{{data.src}}" alt="{{data.alt}}" title="{{data.title}}" data-caption="{{data.caption}}" data-src="{{data.full_src}}" data-large_image="{{data.full_src}}" data-large_image_width="{{data.full_src_w}}" data-large_image_height="{{data.full_src_h}}" srcset="{{data.srcset}}" sizes="{{data.sizes}}"/>
        </div>
        <# } #>

    </div>
</script>