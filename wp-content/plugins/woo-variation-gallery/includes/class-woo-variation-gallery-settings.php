<?php
	
	defined( 'ABSPATH' ) or die( 'Keep Quit' );
	
	if ( ! class_exists( 'Woo_Variation_Gallery_Settings' ) ):
		class Woo_Variation_Gallery_Settings {
			
			public function __construct() {
				add_filter( 'woocommerce_settings_tabs_array', array( $this, 'add_settings_tab' ), 50 );
				add_action( 'woocommerce_settings_woo-variation-gallery', array( $this, 'settings_tab' ) );
				add_action( 'woocommerce_update_options_woo-variation-gallery', array( $this, 'update_settings' ) );
				add_action( 'admin_menu', array( $this, 'admin_menu' ) );
			}
			
			public function admin_menu() {
				
				$page_title = esc_html__( 'WooCommerce Variation Gallery Settings', 'woo-variation-gallery' );
				$menu_title = esc_html__( 'Gallery Settings', 'woo-variation-gallery' );
				
				$settings_link = esc_url( add_query_arg( array(
					                                         'page' => 'wc-settings',
					                                         'tab'  => 'woo-variation-gallery',
					                                         // 'section' => 'woo-variation-gallery'
				                                         ), admin_url( 'admin.php' ) ) );
				
				add_menu_page( $page_title, $menu_title, 'edit_theme_options', $settings_link, '', 'dashicons-images-alt2', 32 );
			}
			
			public function add_settings_tab( $settings_tabs ) {
				$settings_tabs[ 'woo-variation-gallery' ] = esc_html__( 'WooCommerce Variation Gallery', 'woo-variation-gallery' );
				
				return $settings_tabs;
			}
			
			public function settings_tab() {
				woocommerce_admin_fields( $this->get_settings() );
			}
			
			public function update_settings() {
				woocommerce_update_options( $this->get_settings() );
			}
			
			public function get_settings() {
				
				$settings = array(
					
					array(
						'title' => esc_html__( 'WooCommerce Variation Gallery', 'woo-variation-gallery' ),
						'type'  => 'title',
						'desc'  => '',
						'id'    => 'woo_variation_gallery_section'
					),
					
					array(
						'title'             => esc_html__( 'Thumbnails Item', 'woo-variation-gallery' ),
						'type'              => 'number',
						'default'           => absint( apply_filters( 'woo_variation_gallery_default_thumbnails_columns', 4 ) ),
						'css'               => 'width:50px;',
						'desc_tip'          => esc_html__( 'Product Thumbnails Item Image', 'woo-variation-gallery' ),
						'desc'              => '<br>' . sprintf( esc_html__( 'Product Thumbnails Item Image. Default value is: %d. Limit: 2-8.', 'woo-variation-gallery' ), absint( apply_filters( 'woo_variation_gallery_default_thumbnails_columns', 4 ) ) ),
						'id'                => 'woo_variation_gallery_thumbnails_columns',
						'custom_attributes' => array(
							'min'  => 2,
							'max'  => 8,
							'step' => 1,
						),
					),
					
					array(
						'title'             => esc_html__( 'Thumbnails Gap', 'woo-variation-gallery' ),
						'type'              => 'number',
						'default'           => absint( apply_filters( 'woo_variation_gallery_default_thumbnails_gap', 0 ) ),
						'css'               => 'width:50px;',
						'desc_tip'          => esc_html__( 'Product Thumbnails Gap In Pixel', 'woo-variation-gallery' ),
						'desc'              => 'px <br>' . sprintf( esc_html__( 'Product Thumbnails Gap In Pixel. Default value is: %d. Limit: 0-20.', 'woo-variation-gallery' ), apply_filters( 'woo_variation_gallery_default_thumbnails_gap', 0 ) ),
						'id'                => 'woo_variation_gallery_thumbnails_gap',
						'custom_attributes' => array(
							'min'  => 0,
							'max'  => 20,
							'step' => 1,
						),
					),
					
					// Default Gallery Width
					array(
						'title'             => esc_html__( 'Gallery Width', 'woo-variation-gallery' ),
						'type'              => 'number',
						'default'           => absint( apply_filters( 'woo_variation_gallery_default_width', 30 ) ),
						'css'               => 'width:60px;',
						'desc_tip'          => esc_html__( 'Slider gallery width in % for large devices.', 'woo-variation-gallery' ),
						'desc'              => '%. For large devices.<br>' . sprintf( __( 'Slider Gallery Width in %%. Default value is: %d. Limit: 10-100. Please check this <a target="_blank" href="%s">how to video to configure it.</a>', 'woo-variation-gallery' ), absint( apply_filters( 'woo_variation_gallery_default_width', 30 ) ), 'http://bit.ly/video-tuts-for-deactivate-dialogue' ),
						'id'                => 'woo_variation_gallery_width',
						'custom_attributes' => array(
							'min'  => 10,
							'max'  => 100,
							'step' => 1,
						),
					),
					
					// Medium Devices, Desktop
					array(
						'title'             => esc_html__( 'Gallery Width', 'woo-variation-gallery' ),
						'type'              => 'number',
						'default'           => absint( apply_filters( 'woo_variation_gallery_medium_device_width', 0 ) ),
						'css'               => 'width:60px;',
						'desc_tip'          => esc_html__( 'Slider gallery width in px for medium devices, small desktop', 'woo-variation-gallery' ),
						'desc'              => 'px. For medium devices.<br>' . esc_html__( 'Slider gallery width in pixel for medium devices, small desktop. Default value is: 0. Limit: 0-1000. Media query (max-width : 992px)', 'woo-variation-gallery' ),
						'id'                => 'woo_variation_gallery_medium_device_width',
						'custom_attributes' => array(
							'min'  => 0,
							'max'  => 1000,
							'step' => 1,
						),
					),
					
					// Small Devices, Tablets
					array(
						'title'             => esc_html__( 'Gallery Width', 'woo-variation-gallery' ),
						'type'              => 'number',
						'default'           => absint( apply_filters( 'woo_variation_gallery_small_device_width', 720 ) ),
						'css'               => 'width:60px;',
						'desc_tip'          => esc_html__( 'Slider gallery width in px for small devices, tablets', 'woo-variation-gallery' ),
						'desc'              => 'px. For small devices, tablets.<br>' . esc_html__( 'Slider gallery width in pixel for medium devices, small desktop. Default value is: 720. Limit: 0-1000. Media query (max-width : 768px)', 'woo-variation-gallery' ),
						'id'                => 'woo_variation_gallery_small_device_width',
						'custom_attributes' => array(
							'min'  => 0,
							'max'  => 1000,
							'step' => 1,
						),
					),
					
					// Extra Small Devices, Phones
					array(
						'title'             => esc_html__( 'Gallery Width', 'woo-variation-gallery' ),
						'type'              => 'number',
						'default'           => absint( apply_filters( 'woo_variation_gallery_extra_small_device_width', 320 ) ),
						'css'               => 'width:60px;',
						'desc_tip'          => esc_html__( 'Slider gallery width in px for extra small devices, phones', 'woo-variation-gallery' ),
						'desc'              => 'px. For extra small devices, mobile.<br>' . esc_html__( 'Slider gallery width in pixel for extra small devices, phones. Default value is: 320. Limit: 0-1000. Media query (max-width : 480px)', 'woo-variation-gallery' ),
						'id'                => 'woo_variation_gallery_extra_small_device_width',
						'custom_attributes' => array(
							'min'  => 0,
							'max'  => 1000,
							'step' => 1,
						),
					),
					
					
					// Gallery Bottom GAP
					array(
						'title'             => esc_html__( 'Gallery Bottom Gap', 'woo-variation-gallery' ),
						'type'              => 'number',
						'default'           => absint( apply_filters( 'woo_variation_gallery_default_margin', 30 ) ),
						'css'               => 'width:60px;',
						'desc_tip'          => esc_html__( 'Slider gallery gottom margin in pixel', 'woo-variation-gallery' ),
						'desc'              => 'px <br>' . sprintf( esc_html__( 'Slider gallery bottom margin in pixel. Default value is: %d. Limit: 10-100.', 'woo-variation-gallery' ), apply_filters( 'woo_variation_gallery_default_margin', 30 ) ),
						'id'                => 'woo_variation_gallery_margin',
						'custom_attributes' => array(
							'min'  => 10,
							'max'  => 100,
							'step' => 1,
						),
					),
					
					array(
						'title'   => esc_html__( 'Reset Variation Gallery', 'woo-variation-gallery' ),
						'type'    => 'checkbox',
						'default' => 'yes',
						'desc'    => esc_html__( 'Always Reset Gallery After Variation Select', 'woo-variation-gallery' ),
						'id'      => 'woo_variation_gallery_reset_on_variation_change'
					),
					
					array(
						'title'   => esc_html__( 'Preload Style', 'woo-variation-gallery' ),
						'type'    => 'select',
						'class'   => 'wc-enhanced-select',
						'default' => 'blur',
						'id'      => 'woo_variation_gallery_preload_style',
						'options' => array(
							'fade' => esc_html__( 'Fade', 'woo-variation-gallery' ),
							'blur' => esc_html__( 'Blur', 'woo-variation-gallery' ),
							'gray' => esc_html__( 'Gray', 'woo-variation-gallery' ),
						)
					),
					
					array(
						'type' => 'sectionend',
						'id'   => 'woo_variation_gallery_section'
					)
				);
				
				return apply_filters( 'woo_variation_gallery_settings', $settings );
			}
		}
		
		new Woo_Variation_Gallery_Settings();
	endif;