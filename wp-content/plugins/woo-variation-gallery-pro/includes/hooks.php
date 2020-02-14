<?php
	
	defined( 'ABSPATH' ) or die( 'Keep Quit' );
	
	add_filter( 'woo_variation_gallery_settings', function ( $settings ) {
		
		$pro_settings = array(
			array(
				'title' => esc_html__( 'WooCommerce Variation Gallery Pro', 'woo-variation-gallery-pro' ),
				'type'  => 'title',
				'desc'  => '',
				'id'    => 'woo_variation_gallery_pro_section'
			),
			
			array(
				'title'   => esc_html__( 'Show Slider Arrow', 'woo-variation-gallery-pro' ),
				'type'    => 'checkbox',
				'default' => 'yes',
				'desc'    => esc_html__( 'Show Gallery Slider Arrow', 'woo-variation-gallery-pro' ),
				'id'      => 'woo_variation_gallery_slider_arrow'
			),
			
			
			array(
				'title'   => esc_html__( 'Enable Image Zoom', 'woo-variation-gallery-pro' ),
				'type'    => 'checkbox',
				'default' => 'yes',
				'desc'    => esc_html__( 'Enable Gallery Image Zoom', 'woo-variation-gallery-pro' ),
				'id'      => 'woo_variation_gallery_zoom'
			),
			
			array(
				'title'   => esc_html__( 'Enable Image Popup', 'woo-variation-gallery-pro' ),
				'type'    => 'checkbox',
				'default' => 'yes',
				'desc'    => esc_html__( 'Enable Gallery Image Popup', 'woo-variation-gallery-pro' ),
				'id'      => 'woo_variation_gallery_lightbox'
			),
			
			array(
				'title'   => esc_html__( 'Enable Thumbnail Slide', 'woo-variation-gallery-pro' ),
				'type'    => 'checkbox',
				'default' => 'yes',
				'desc'    => esc_html__( 'Enable Gallery Thumbnail Slide', 'woo-variation-gallery-pro' ),
				'id'      => 'woo_variation_gallery_thumbnail_slide'
			),
			
			array(
				'title'   => esc_html__( 'Show Thumbnail Arrow', 'woo-variation-gallery-pro' ),
				'type'    => 'checkbox',
				'default' => 'yes',
				'desc'    => esc_html__( 'Show Gallery Thumbnail Arrow', 'woo-variation-gallery-pro' ),
				'id'      => 'woo_variation_gallery_thumbnail_arrow'
			),
			
			
			array(
				'title'    => esc_html__( 'Zoom Icon Display Position', 'woo-variation-gallery-pro' ),
				'id'       => 'woo_variation_gallery_zoom_position',
				'default'  => 'top-right',
				//'type'     => 'radio',
				'type'     => 'select',
				'class'    => 'wc-enhanced-select',
				'desc_tip' => esc_html__( 'Product Gallery Zoom Icon Display Position', 'woo-variation-gallery-pro' ),
				'options'  => array(
					'top-right'    => esc_html__( 'Top Right', 'woo-variation-gallery-pro' ),
					'top-left'     => esc_html__( 'Top Left', 'woo-variation-gallery-pro' ),
					'bottom-right' => esc_html__( 'Bottom Right', 'woo-variation-gallery-pro' ),
					'bottom-left'  => esc_html__( 'Bottom Left', 'woo-variation-gallery-pro' ),
				),
			),
			
			array(
				'title'    => esc_html__( 'Thumbnail Display Position', 'woo-variation-gallery-pro' ),
				'id'       => 'woo_variation_gallery_thumbnail_position',
				'default'  => 'bottom',
				//'type'     => 'radio',
				'type'     => 'select',
				'class'    => 'wc-enhanced-select',
				'desc_tip' => esc_html__( 'Product Gallery Thumbnail Display Position', 'woo-variation-gallery-pro' ),
				'options'  => array(
					'left'   => esc_html__( 'Left', 'woo-variation-gallery' ),
					'right'  => esc_html__( 'Right', 'woo-variation-gallery' ),
					'bottom' => esc_html__( 'Bottom', 'woo-variation-gallery' ),
				),
			),
			
			array(
				'title' => esc_html__( 'License key', 'woo-variation-gallery-pro' ),
				'type'  => 'text',
				'desc'  => '<br>' . __( 'Please add product license key and add your domain(s) on <a target="_blank" href="https://getwooplugins.com/my-account/downloads/">GetWooPlugins.com -> My Downloads</a> to get automatic update.', 'woo-variation-gallery-pro' ),
				'id'    => 'woo_variation_gallery_license'
			),
			array(
				'type' => 'sectionend',
				'id'   => 'woo_variation_gallery_pro_section'
			)
		);
		
		foreach ( $pro_settings as $option ) {
			array_push( $settings, $option );
		}
		
		return $settings;
		
	} );
	
	add_filter( 'attachment_fields_to_edit', function ( $form_fields, $post ) {
		
		$form_fields[ 'woo_variation_gallery_media_title' ] = array(
			'tr' => sprintf( '<hr><h2>%s</h2>', __( 'Variation Gallery Video', 'woo-variation-gallery-pro' ) )
		);
		
		$form_fields[ 'woo_variation_gallery_media_video' ] = array(
			'label' => esc_html__( 'Video URL', 'woo-variation-gallery-pro' ),
			'input' => 'text',
			//'show_in_edit' => false,
			'value' => get_post_meta( $post->ID, 'woo_variation_gallery_media_video', true )
		);
		
		$form_fields[ 'woo_variation_gallery_media_video_popup' ] = array(
			'label' => '',
			'input' => 'html',
			//'show_in_edit' => false,
			'html'  => '<a class="woo_variation_gallery_media_video_popup_link" href="#"><span class="dashicons dashicons-video-alt3"></span></a>',
		);
		
		$form_fields[ 'woo_variation_gallery_media_video_width' ] = array(
			'label' => esc_html__( 'Width', 'woo-variation-gallery-pro' ),
			'input' => 'text',
			//'show_in_edit' => false,
			'value' => get_post_meta( $post->ID, 'woo_variation_gallery_media_video_width', true ),
			'helps' => esc_html__( 'Video Width. px or %. Empty for default', 'woo-variation-gallery-pro' )
		);
		
		$form_fields[ 'woo_variation_gallery_media_video_height' ] = array(
			'label' => esc_html__( 'Height', 'woo-variation-gallery-pro' ),
			'input' => 'text',
			//'show_in_edit' => false,
			'value' => get_post_meta( $post->ID, 'woo_variation_gallery_media_video_height', true ),
			'helps' => esc_html__( 'Video Height. px or %. Empty for default', 'woo-variation-gallery-pro' )
		);
		
		return $form_fields;
	}, 10, 2 );
	
	add_filter( 'attachment_fields_to_save', function ( $post, $attachment ) {
		
		if ( isset( $attachment[ 'woo_variation_gallery_media_video' ] ) ) {
			update_post_meta( $post[ 'ID' ], 'woo_variation_gallery_media_video', trim( $attachment[ 'woo_variation_gallery_media_video' ] ) );
		}
		
		if ( isset( $attachment[ 'woo_variation_gallery_media_video_width' ] ) ) {
			update_post_meta( $post[ 'ID' ], 'woo_variation_gallery_media_video_width', trim( $attachment[ 'woo_variation_gallery_media_video_width' ] ) );
		}
		
		if ( isset( $attachment[ 'woo_variation_gallery_media_video_height' ] ) ) {
			update_post_meta( $post[ 'ID' ], 'woo_variation_gallery_media_video_height', trim( $attachment[ 'woo_variation_gallery_media_video_height' ] ) );
		}
		
		return $post;
	}, 10, 2 );
	
	add_filter( 'wp_prepare_attachment_for_js', function ( $response, $attachment, $meta ) {
		
		$id        = absint( $attachment->ID );
		$has_video = trim( get_post_meta( $id, 'woo_variation_gallery_media_video', true ) );
		
		$response[ 'woo_variation_gallery_video' ] = $has_video;
		
		return $response;
	}, 10, 3 );
	
	add_filter( 'woo_variation_gallery_admin_template_js', function () {
		require_once 'admin-template-js.php';
	} );
	
	add_filter( 'woo_variation_gallery_slider_template_js', function () {
		require_once 'slider-template-js.php';
	} );
	
	add_filter( 'woo_variation_gallery_thumbnail_template_js', function () {
		require_once 'thumbnail-template-js.php';
	} );
	
	add_filter( 'woo_variation_gallery_slider_js_options', function ( $options ) {
		
		if ( 'yes' === get_option( 'woo_variation_gallery_slider_arrow', 'yes' ) ) {
			$options[ 'arrows' ] = true;
		}
		
		if ( 'yes' === get_option( 'woo_variation_gallery_thumbnail_slide', 'yes' ) ) {
			$options[ 'asNavFor' ] = '.woo-variation-gallery-thumbnail-slider';
		}
		
		$options[ 'prevArrow' ] = '<i class="wvg-slider-prev-arrow dashicons dashicons-arrow-left-alt2"></i>';
		$options[ 'nextArrow' ] = '<i class="wvg-slider-next-arrow dashicons dashicons-arrow-right-alt2"></i>';
		
		
		return $options;
	} );
	
	add_filter( 'woo_variation_gallery_thumbnail_slider_js_options', function ( $options ) {
		
		if ( 'yes' === get_option( 'woo_variation_gallery_thumbnail_arrow', 'yes' ) ) {
			$options[ 'arrows' ] = true;
		}
		
		$options[ 'prevArrow' ] = '<i class="wvg-thumbnail-prev-arrow dashicons dashicons-arrow-left-alt2"></i>';
		$options[ 'nextArrow' ] = '<i class="wvg-thumbnail-next-arrow dashicons dashicons-arrow-right-alt2"></i>';
		
		$thumbnail_position = get_option( 'woo_variation_gallery_thumbnail_position', 'bottom' );
		
		if ( in_array( $thumbnail_position, array( 'left', 'right' ) ) ) {
			$options[ 'vertical' ] = true;
		}
		
		$options[ 'responsive' ] = array(
			array(
				'breakpoint' => 768,
				'settings'   => array(
					'vertical' => false
				),
			),
			
			array(
				'breakpoint' => 480,
				'settings'   => array(
					'vertical' => false
				),
			)
		);
		
		return $options;
	} );
	
	add_filter( 'woo_variation_gallery_js_options', function ( $options ) {
		
		if ( 'yes' === get_option( 'woo_variation_gallery_thumbnail_slide', 'yes' ) ) {
			$options[ 'enable_thumbnail_slide' ] = true;
		}
		
		$thumbnail_position                           = get_option( 'woo_variation_gallery_thumbnail_position', 'bottom' );
		$options[ 'is_vertical' ]                     = in_array( $thumbnail_position, array( 'left', 'right' ) );
		$options[ 'thumbnail_position' ]              = trim( $thumbnail_position );
		$options[ 'thumbnail_position_class_prefix' ] = 'woo-variation-gallery-thumbnail-position-';
		
		return $options;
	} );
	
	add_filter( 'woo_variation_gallery_product_image_classes', function ( $classes ) {
		
		if ( 'yes' === get_option( 'woo_variation_gallery_thumbnail_slide', 'yes' ) ) {
			$classes[] = 'woo-variation-gallery-enabled-thumbnail-slider';
		}
		
		return $classes;
	} );