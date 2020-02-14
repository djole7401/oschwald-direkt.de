<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

class WC_GZDP_VAT_Helper {

	protected static $_instance = null;

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function __construct() {
		
		if ( ! is_admin() || defined( 'DOING_AJAX' ) )
			$this->frontend_hooks();
		
		add_filter( 'woocommerce_localisation_address_formats', array( $this, 'set_vat_field' ), 0, 1 );
		add_filter( 'woocommerce_default_address_fields', array( $this, 'add_vat_field' ), 0, 1 );

		add_filter( 'woocommerce_order_formatted_billing_address', array( $this, 'set_formatted_billing_address' ), 0, 2 );
		add_filter( 'woocommerce_order_formatted_shipping_address', array( $this, 'set_formatted_shipping_address' ), 0, 2 );

		add_filter( 'woocommerce_admin_billing_fields', array( $this, 'set_admin_billing_address' ), 0, 1 );
		add_filter( 'woocommerce_admin_shipping_fields', array( $this, 'set_admin_shipping_address' ), 0, 1 );

		add_filter( 'woocommerce_get_country_locale', array( $this, 'hide_vat_field' ), 0, 1 );
		add_filter( 'woocommerce_country_locale_field_selectors', array( $this, 'hide_vat_field_js' ), 0, 1 );
		add_filter( 'woocommerce_formatted_address_replacements', array( $this, 'add_vat_address' ), 0, 2 );

		add_filter( 'woocommerce_customer_meta_fields', array( $this, 'add_vat_field_profile' ), 0, 1 );

		add_action( 'edit_user_profile_update', array( $this, 'save_billing_vat_id_field_profile' ), 5 );
		add_action( 'edit_user_profile_update', array( $this, 'save_shipping_vat_id_field_profile' ), 5 );

		add_action( 'personal_options_update', array( $this, 'save_billing_vat_id_field_profile' ), 5 );
		add_action( 'personal_options_update', array( $this, 'save_shipping_vat_id_field_profile' ), 5 );

		if ( WC_GZDP_Dependencies::instance()->woocommerce_version_supports_crud() ) {
			add_filter( 'woocommerce_ajax_get_customer_details', array( $this, 'customer_details_load_vat_id' ), 10, 3 );
		} else {
			add_filter( 'woocommerce_found_customer_details', array( $this, 'customer_details_load_vat_id_legacy' ), 10, 3 );
		}

		add_filter( 'woocommerce_ajax_calc_line_taxes', array( $this, 'calc_order_taxes' ), 0, 4 );
		add_action( 'woocommerce_before_order_object_save', array( $this, 'calc_order_taxes_v3' ), 10, 2 );
		add_filter( 'woocommerce_ajax_get_customer_details', array( $this, 'load_customer_vat_id' ), 10, 3 );

		// New Woo Order vat exempt filter
		add_filter( 'woocommerce_order_is_vat_exempt', array( $this, 'order_has_vat_exempt_filter' ), 10, 2 );
	}

	public function load_customer_vat_id( $data, $customer, $user_id ) {
		$types = array( 'shipping', 'billing' );

		foreach( $types as $type ) {

			if ( ! isset( $data[ $type ] ) )
				continue;

			$data[ $type ]['vat_id'] = get_user_meta( $user_id,  $type . '_vat_id', true );
		}

		return $data;
	}

	public function frontend_hooks() {
		// Use cart calculate totals filter and check if we are validating checkout (compatibility to multistep checkout)
		add_action( 'woocommerce_before_calculate_totals', array( $this, 'set_vat_prices_process_checkout' ), 0 );
		// Make sure that taxes for fees are removed
		add_action( 'woocommerce_after_calculate_totals', array( $this, 'maybe_remove_fee_taxes' ), 10, 1 );
		
		add_filter( 'woocommerce_process_myaccount_field_billing_vat_id', array( $this, 'user_save_billing_vat_id' ), 0, 1 );
		add_filter( 'woocommerce_process_myaccount_field_shipping_vat_id', array( $this, 'user_save_shipping_vat_id' ), 0, 1 );

		// If is VAT exempt (and net prices are used) set tax rounding precision to 2
		add_action( 'woocommerce_before_calculate_totals', array( $this, 'set_tax_rounding' ) );
		// If prices do not include tax, set taxes to zero if vat exempt
		add_filter( 'woocommerce_calc_tax', array( $this, 'set_price_excluding_tax' ), 0, 5 );
		// Set min max prices for variable products to exclude tax if is vat exempt (pre 1.4.8)
		add_filter( 'woocommerce_variation_prices', array( $this, 'set_variable_exempt' ), 10, 3 );
		// Vat ID check = 0
		add_action( 'woocommerce_after_checkout_validation', array( $this, 'validate_number_after_submit' ), 0, 1 );

		add_filter( 'woocommerce_process_checkout_field_billing_vat_id', array( $this, 'set_billing_vat_id_format' ), 10, 1 );
		add_filter( 'woocommerce_process_checkout_field_shipping_vat_id', array( $this, 'set_shipping_vat_id_format' ), 10, 1 );

		add_filter( 'default_checkout_billing_vat_id', array( $this, 'get_checkout_vat_id_from_session' ), 10, 2 );
		add_filter( 'default_checkout_shipping_vat_id', array( $this, 'get_checkout_vat_id_from_session' ), 10, 2 );

		add_action( 'wp_head', array( $this, 'maybe_set_customer_vat_exempt' ), 10 );

		// Register Form
		if ( 'yes' === get_option( 'woocommerce_gzdp_enable_vat_check_register' ) ) {
			add_action( 'woocommerce_register_form', array( $this, 'register_form_input' ), 10 );
			add_filter( 'woocommerce_process_registration_errors', array( $this, 'validate_register_vat_id' ), 10, 4 );
			add_action( 'woocommerce_created_customer', array( $this, 'register_vat_id_customer' ), 10, 3 );
		}
	}

	public function register_vat_id_customer( $customer_id, $new_customer_data, $password_generated ) {
		$vat_id = isset( $_POST['vat_id'] ) ? wc_clean( $_POST['vat_id'] ) : '';

		if ( ! empty( $vat_id ) ) {
			$vat_id_fragments = $this->get_vat_id_from_string( $vat_id );

			if ( $this->validate( $vat_id_fragments['country'], $vat_id_fragments['number'] ) ) {
				add_user_meta( $customer_id, 'billing_vat_id', $this->set_vat_id_format( $vat_id_fragments['number'], $vat_id_fragments['country'] ) );
				add_user_meta( $customer_id, 'billing_country', $vat_id_fragments['country'] );

				// Make sure customer is a vat exempt
				$this->set_vat_exempt( $vat_id_fragments['country'] );
			}
		}
	}

	public function validate_register_vat_id( $validation_error, $username, $password, $email ) {
		$vat_id = isset( $_POST['vat_id'] ) ? wc_clean( $_POST['vat_id'] ) : '';

		if ( empty( $vat_id ) && $this->vat_field_is_required() ) {
			$validation_error->add( 'wc_gzdp_registration_vat_id_missing', __( 'A valid VAT ID is required to register.', 'woocommerce-germanized-pro' ) );
		}

		if ( ! empty( $vat_id ) ) {
			$vat_id_fragments = $this->get_vat_id_from_string( $vat_id );

			if ( ! $this->country_supports_vat_id( $vat_id_fragments['country'] ) ) {
				$country_name = isset( WC()->countries->countries[ $vat_id_fragments['country'] ] ) ? WC()->countries->countries[ $vat_id_fragments['country'] ] : '';

				if ( ! empty( $country_name ) ) {
					$validation_error->add( 'wc_gzdp_registration_vat_id_country_not_supported', sprintf( __( 'Sorry but we do not support VAT IDs within %s.', 'woocommerce-germanized-pro' ), $country_name ) );
				} else {
					$validation_error->add( 'wc_gzdp_registration_vat_id_country_not_supported', __( 'Sorry but we do not support VAT IDs within your country.', 'woocommerce-germanized-pro' ) );
				}
			}

			if ( ! $this->validate( $vat_id_fragments['country'], $vat_id_fragments['number'] ) ) {
				$validation_error->add( 'wc_gzdp_registration_vat_id_invalid', __( 'Sorry but the provided VAT ID seems to be invalid.', 'woocommerce-germanized-pro' ) );
			}
		}

		return $validation_error;
	}

	public function register_form_input() {
		wc_get_template( 'myaccount/form-register-vat-id.php', array( 'required' => $this->vat_field_is_required() ) );
	}

	public function get_checkout_vat_id_from_session( $value, $input ) {
		if ( WC()->session && WC()->session->get( $input ) ) {
			return WC()->session->get( $input );
		}

		return $value;
	}

	public function maybe_set_customer_vat_exempt() {

		if ( get_option( 'woocommerce_gzdp_enable_vat_check_login' ) === 'no' )
			return;

		if ( ! function_exists( 'is_woocommerce' ) || ! function_exists( 'is_cart' ) || ! function_exists( 'is_checkout' ) || ! function_exists( 'is_account_page' ) ) {
			return;
		}

		if ( ( is_woocommerce() || is_cart() || is_checkout() || is_account_page() ) && WC()->customer ) {
			WC()->customer->set_is_vat_exempt( false );

			if ( $vat_id  = $this->get_user_vat_id( get_current_user_id() ) ) {
				$elements = $this->get_vat_id_from_string( $vat_id );

				if ( $this->validate( $elements['country'], $elements['number'] ) ) {
					$this->set_vat_exempt();
				}
			}
		}
	}

	public function maybe_remove_fee_taxes( $cart ) {
		if ( WC()->customer && WC()->customer->is_vat_exempt() ) {
			foreach( $cart->get_fees() as $fee ) {
				$fee->tax = 0;
				$fee->tax_data = array();
			}
		}
	}

	public function get_vat_address_type_by_checkout_data( $posted ) {
		$billing_country = isset( $posted[ 'billing_country' ] ) ? $posted[ 'billing_country' ] : WC()->countries->get_base_country();
		$shipping_country = ( isset( $posted[ 'ship_to_different_address' ] ) && $posted[ 'ship_to_different_address' ] ) ? $posted[ 'shipping_country' ] : '';

		$type = $this->get_vat_address_type_by_countries( $billing_country, $shipping_country );

		return $type;
	}

	public function validate_number_after_submit( $posted ) {
		$address_type = $this->get_vat_address_type_by_checkout_data( $posted );

		WC()->customer->set_is_vat_exempt( false );

		if ( WC()->session ) {
			WC()->session->set( "billing_vat_id", '' );
			WC()->session->set( "shipping_vat_id", '' );
		}

		if ( isset( $posted[ "{$address_type}_vat_id" ] ) && ( ! empty( $posted[ "{$address_type}_vat_id" ] ) || $posted[ "{$address_type}_vat_id" ] == '0' ) ) {

			$vat_id_elements = $this->get_vat_id_from_string( $posted[ "{$address_type}_vat_id" ], $posted[ "{$address_type}_country" ] );
			$country         = isset( $posted[ "{$address_type}_country" ] ) ? strtoupper( wc_clean( $posted[ "{$address_type}_country" ] ) ) : $vat_id_elements['country'];

			if ( ! $this->validate( $vat_id_elements['country'], $vat_id_elements['number'] ) ) {
				wc_add_notice( __( 'VAT ID seems to be invalid.', 'woocommerce-germanized-pro' ), 'error' );
			} else {
				if ( WC()->session ) {
					WC()->session->set( "{$address_type}_vat_id", $vat_id_elements['country'] . $vat_id_elements['number'] );
				}
				$this->set_vat_exempt( $country );
			}
		}
	}

	public function customer_details_load_vat_id( $customer_data, $customer, $user_id ) {
		$customer_data[ "shipping" ][ 'vat_id' ] = get_user_meta( $user_id, "shipping_vat_id", true );
		$customer_data[ "billing" ][ 'vat_id' ] = get_user_meta( $user_id, "billing_vat_id", true );
		return $customer_data;
	}

	public function customer_details_load_vat_id_legacy( $customer_data, $user_id, $type_to_load ) {
		$customer_data[ "{$type_to_load}_vat_id" ] = get_user_meta( $user_id, "{$type_to_load}_vat_id", true );
		return $customer_data;
	}

	public function get_vat_id_prefix_by_country( $country ) {

		$country = strtoupper( $country );

		// Treat Isle of Man as UK and Monaco as FR
		$map = array(
			'GR' => 'EL',
			'MC' => 'FR',
			'IM' => 'UK',
		);

		if ( isset( $map[ $country ] ) )
			return $map[ $country ];

		return $country;
	}

	public function get_vat_id_from_string( $number, $expected_country = '' ) {

		$number = trim( preg_replace( "/[^a-z0-9.]+/i", "", sanitize_text_field( $number ) ) );

		if ( ! empty( $expected_country ) ) {
			$expected_country = $this->get_vat_id_prefix_by_country( $expected_country );
		}

		$maybe_country = substr( $number, 0, 2 );

		if ( empty( $expected_country ) ) {

			preg_match( "/^([A-Z]+)/", $maybe_country, $matches );
			
			if ( ! empty( $matches ) ) {
				$expected_country = $maybe_country;
				$number = substr( $number, 2 );
			} else {
				$expected_country = $this->get_vat_id_prefix_by_country( WC()->countries->get_base_country() );
			}
		} elseif ( $maybe_country == $this->get_vat_id_prefix_by_country( $expected_country ) ) {
			$number = substr( $number, 2 );
		}

		return array( 
			"number" 	=> $number,
			"country" 	=> $expected_country,
		);

	}

	public function set_vat_id_format( $number, $country ) {
		$elements = $this->get_vat_id_from_string( $number, $country );

		return apply_filters( 'woocommerce_gzdp_vat_id_format', $elements[ 'country' ] . $elements[ 'number' ], $number, $country );
	}

	public function set_billing_vat_id_format( $data = '' ) {
		if ( empty( $data ) )
			return $data;

		return $this->set_vat_id_format( $data, ( isset( $_POST[ 'billing_country' ] ) ? wc_clean( $_POST[ 'billing_country' ] ) :  WC()->countries->get_base_country() ) );
	}

	public function set_shipping_vat_id_format( $data = '' ) {
		if ( empty( $data ) )
			return $data;

		return $this->set_vat_id_format( $data, ( isset( $_POST[ 'shipping_country' ] ) ? wc_clean( $_POST[ 'shipping_country' ] ) :  WC()->countries->get_base_country() ) );
	}

	public function set_variable_exempt( $prices_array, $product, $display ) {
		if ( WC()->customer && WC()->customer->is_vat_exempt() && 'incl' === get_option( 'woocommerce_tax_display_shop' ) ) {
			foreach ( $prices_array as $type => $variations ) {
				foreach ( $variations as $variation_id => $price ) {
					$variation = wc_gzd_get_variation( $product, $variation_id );
					$prices_array[ $type ][ $variation_id ] = wc_gzd_get_price_excluding_tax( $variation, array( 'qty' => 1, 'price' => $price ) );
				}
				asort( $prices_array[ $type ] );
			}

			// Prevent multiple vat removal
			remove_filter( 'woocommerce_variation_prices', array( $this, 'set_variable_exempt' ), 10 );
		}
		return $prices_array;
	}

	public function set_price_excluding_tax( $taxes, $price, $rates, $price_includes_tax, $suppress_rounding ) {
		if ( ! wc_prices_include_tax() && ! $price_includes_tax && is_object( WC()->customer ) && WC()->customer->is_vat_exempt() )
			$taxes = array();

		return $taxes;
	}

	public function set_tax_rounding() {
		if ( is_object( WC()->customer ) && WC()->customer->is_vat_exempt() && WC()->cart->prices_include_tax ) {
			add_filter( 'woocommerce_calc_tax', array( $this, 'tax_round' ), 0, 5 );
		} else {
			remove_filter( 'woocommerce_calc_tax', array( $this, 'tax_round' ), 0 );
		}
	}

	public function tax_round( $taxes, $price, $rates, $price_includes_tax, $suppress_rounding ) {

		if ( apply_filters( 'woocommerce_gzdp_vat_id_disable_inc_tax_rounding', false ) ) {
			return $taxes;
		}

		foreach( $taxes as $key => $tax ) {
			$taxes[ $key ] = WC_Tax::round( $tax );
		}

		return $taxes;
	}

	protected function user_save_vat_id( $vat_id = '', $country ) {
		$valid = false;

		$number   = wc_clean( $vat_id );
		$elements = $this->get_vat_id_from_string( $number, $country );

		if ( $this->validate( $elements[ 'country' ], $elements[ 'number' ] ) )
			$valid = true;

		if ( ! $valid ) {
			wc_add_notice( __( 'VAT ID seems to be invalid.', 'woocommerce-germanized-pro' ), 'error' );
			return '';
		}

		return $vat_id;
	}

	public function user_save_shipping_vat_id( $vat_id = '' ) {
		if ( ! empty( $vat_id ) ) {
			$shipping_country = ( isset( $_POST['shipping_country'] ) ? wc_clean( $_POST['shipping_country'] ) : '' );

			if ( empty( $shipping_country ) ) {
				wc_add_notice( __( 'Please choose a shipping country before saving your VAT ID.', 'woocommerce-germanized-pro' ), 'error' );
				return '';
			}

			return $this->user_save_vat_id( $vat_id, $shipping_country );
		}
		return $vat_id;
	}

	public function user_save_billing_vat_id( $vat_id = '' ) {
		if ( ! empty( $vat_id ) ) {
			$billing_country = ( isset( $_POST['billing_country'] ) ? wc_clean( $_POST['billing_country'] ) : WC()->countries->get_base_country() );

			return $this->user_save_vat_id( $vat_id, $billing_country );
		}
		return $vat_id;
	}

	public function get_vat_address_type_by_countries( $billing_country, $shipping_country = '' ) {
		$type = 'shipping';

		$shipping_country_exists = ( ! empty( $shipping_country ) ? true : false );

		if ( empty( $shipping_country ) )
			$shipping_country = $billing_country;

		if ( $billing_country === $shipping_country && ! $shipping_country_exists ) {
			$type = 'billing';
		}

		return apply_filters( 'woocommerce_gzdp_vat_address_type_by_countries', $type, $billing_country, $shipping_country );
	}

	public function get_address_differing_fields() {
		return apply_filters( 'woocommerce_gzdp_address_differing_fields', array(
			'company',
			'first_name',
			'last_name',
			'address_1',
			'address_2',
			'city',
			'country',
			'postcode'
		) );
	}

	public function order_has_differing_shipping_address( $order ) {

		if ( is_callable( $order, 'has_shipping_address' ) ) {
			if ( ! $order->has_shipping_address() ) {
				return false;
			}
		} else {
			$address_1 = wc_gzd_get_crud_data( $order, 'shipping_address_1' );
			$address_2 = wc_gzd_get_crud_data( $order, 'shipping_address_2' );

			if ( ! $address_1 && ! $address_2 ) {
				return false;
			}
		}

		foreach( $this->get_address_differing_fields() as $field ) {
			$b_data = wc_gzd_get_crud_data( $order, 'billing_' . $field );
			$s_data = wc_gzd_get_crud_data( $order, 'shipping_' . $field );

			if ( $b_data !== $s_data ) {
				return true;
			}
		}

		return false;
	}

	public function get_vat_address_type_by_order( $order ) {

		if ( is_numeric( $order ) )
			$order = wc_get_order( $order );

		$billing_country = wc_gzd_get_crud_data( $order, 'billing_country' );
		$shipping_country = '';

		if ( $this->order_has_differing_shipping_address( $order ) ) {
			$shipping_country = wc_gzd_get_crud_data( $order, 'shipping_country' );
		}

		return $this->get_vat_address_type_by_countries( $billing_country, $shipping_country );
	}

	public function order_supports_vat_id( $order ) {

		if ( is_numeric( $order ) )
			$order = wc_get_order( $order );

		$eu           = WC()->countries->get_european_union_countries( 'eu_vat' );
		$type         = $this->get_vat_address_type_by_order( $order );
		$vat_id       = $this->get_order_vat_id( $order );
		$user_country = wc_gzd_get_crud_data( $order, "{$type}_country" );

		return ( $vat_id && in_array( WC()->countries->get_base_country(), $eu ) && $this->country_supports_vat_id( $user_country ) );
	}

	public function order_has_vat_exempt_filter( $is_exempt, $order ) {
		if ( ! $is_exempt ) {
			$is_exempt = $this->order_has_vat_exempt( $order );
		}

		return $is_exempt;
	}

	public function order_has_vat_exempt( $order ) {
		if ( is_numeric( $order ) )
			$order = wc_get_order( $order );

		$type         = $this->get_vat_address_type_by_order( $order );
		$user_country = wc_gzd_get_crud_data( $order, "{$type}_country" );

		return ( $this->order_supports_vat_id( $order ) && $this->country_supports_vat_exempt( $user_country ) );
	}

	public function get_order_vat_id( $order ) {
		if ( is_numeric( $order ) )
			$order = wc_get_order( $order );

		$type   = $this->get_vat_address_type_by_order( $order );
		$vat_id = wc_gzd_get_crud_data( $order, "{$type}_vat_id" );

		return ! empty( $vat_id ) ? $vat_id : false;
	}

	public function user_has_differing_shipping_address( $user_id ) {
		$shipping_vat_id = get_user_meta( $user_id, "shipping_vat_id", true );

		// We do not need to check for differing addresses if the user has no shipping_vat_id
		if ( empty( $shipping_vat_id ) ) {
			return false;
		}

		foreach( $this->get_address_differing_fields() as $field ) {

			$b_data = get_user_meta( $user_id, "billing_" . $field, true );
			$s_data = get_user_meta( $user_id, "shipping_" . $field, true );

			if ( ! empty( $s_data ) && $b_data !== $s_data ) {
				return true;
			}
		}

		return false;
	}

	public function get_user_vat_id( $user_id ) {
		if ( WC()->customer && WC()->session ) {

			$billing_country  = $this->get_customer_billing_country();
			$shipping_country = WC()->customer->get_shipping_country() !== $billing_country ?  WC()->customer->get_shipping_country() : '';

			$type = $this->get_vat_address_type_by_countries( $billing_country, $shipping_country );

			if ( ! $this->country_supports_vat_id( $type === 'shipping' ? $shipping_country : $billing_country ) ) {
				return false;
			}

			// As a fallback when session data does not exist, use WC()->customer to retrieve the data
			if ( is_null( WC()->session->get( "{$type}_vat_id" ) ) ) {
				return wc_gzd_get_crud_data( WC()->customer, "{$type}_vat_id", true );
			} else {
				return WC()->session->get( "{$type}_vat_id" );
			}

		} else {
			$billing_country  = get_user_meta( $user_id, 'billing_country', true );
			$shipping_country = ( $this->user_has_differing_shipping_address( $user_id ) ? get_user_meta( $user_id, 'shipping_country', true ) : '' );

			$type = $this->get_vat_address_type_by_countries( $billing_country, $shipping_country );

			if ( ! $this->country_supports_vat_id( $type === 'shipping' ? $shipping_country : $billing_country ) ) {
				return false;
			}

			return get_user_meta( $user_id, "{$type}_vat_id", true );
		}
	}

	public function set_vat_exempt( $country = '' ) {

		if ( empty( $country ) ) {
			$address = WC()->customer->get_taxable_address();
			$country = $address[0];
		}

		if ( $this->country_supports_vat_exempt( $country ) ) {
			WC()->customer->set_is_vat_exempt( true );

			do_action( 'woocommerce_gzdp_customer_is_vat_exempt' );

			if ( ! WC_GZDP_Dependencies::instance()->woocommerce_version_supports_crud() && is_callable( array( WC()->cart, 'remove_taxes' ) ) ) {
				WC()->cart->remove_taxes();
			}
		}
	}

	public function save_billing_vat_id_field_profile(  ) {
		if ( isset( $_POST[ 'billing_vat_id' ] ) && ! empty( $_POST[ 'billing_vat_id' ] ) ) {

			$vat_id   = sanitize_text_field( $_POST[ 'billing_vat_id' ] );
			$country  = ( isset( $_POST[ 'billing_country' ] ) ? $_POST[ 'billing_country' ] : '' );
			$elements = $this->get_vat_id_from_string( $vat_id, $country );

			if ( ! $this->validate( $elements[ 'country' ], $elements[ 'number' ] ) ) {
				add_action( 'user_profile_update_errors', array( $this, 'save_vat_field_profile_error' ), 5, 3 );
			}
		}
	}

	public function save_shipping_vat_id_field_profile(  ) {
		if ( isset( $_POST[ 'shipping_vat_id' ] ) && ! empty( $_POST[ 'shipping_vat_id' ] ) ) {

			$vat_id   = sanitize_text_field( $_POST[ 'shipping_vat_id' ] );
			$country  = ( isset( $_POST[ 'shipping_country' ] ) ? $_POST[ 'shipping_country' ] : '' );
			$elements = $this->get_vat_id_from_string( $vat_id, $country );

			if ( ! $this->validate( $elements[ 'country' ], $elements[ 'number' ] ) ) {
				add_action( 'user_profile_update_errors', array( $this, 'save_vat_field_profile_error' ), 5, 3 );
			}
		}
	}

	public function save_vat_field_profile_error( $errors, $update, $user ) {
		$errors->add( 'billing_vat_id', __( 'VAT ID seems to be invalid but was still saved. Please check the ID again.', 'woocommerce-germanized-pro' ) );
	}

	public function add_vat_field_profile( $fields ) {

		$fields['billing']['fields']['billing_vat_id'] = array(
			'label'       => __( 'VAT ID', 'woocommerce-germanized-pro' ),
			'description' => '',
		);

		$fields['shipping']['fields']['shipping_vat_id'] = array(
			'label'       => __( 'VAT ID', 'woocommerce-germanized-pro' ),
			'description' => '',
		);

		return $fields;

	}

	public function set_admin_billing_address( $fields ) {
		
		$fields['vat_id'] = array(
			'label' => __( 'VAT ID', 'woocommerce-germanized-pro' ),
			'show'  => false
		);

		return $fields;  
	}

	public function set_admin_shipping_address( $fields ) {

		$fields['vat_id'] = array(
			'label' => __( 'VAT ID', 'woocommerce-germanized-pro' ),
			'show'  => false
		);

		return $fields;
	}

	public function set_formatted_billing_address( $fields = array(), $order ) {
		
		$fields['vat_id'] = '';

		$type = $this->get_vat_address_type_by_order( $order );
		
		if ( ( 'billing' === $type ) && wc_gzd_get_crud_data( $order, 'billing_vat_id' ) )
			$fields['vat_id'] = wc_gzd_get_crud_data( $order, 'billing_vat_id' );
		
		return $fields;
	}

	public function set_formatted_shipping_address( $fields = array(), $order ) {

		$fields['vat_id'] = '';

		$type = $this->get_vat_address_type_by_order( $order );

		if ( ( 'shipping' === $type ) && wc_gzd_get_crud_data( $order, 'shipping_vat_id' ) )
			$fields['vat_id'] = wc_gzd_get_crud_data( $order, 'shipping_vat_id' );

		return $fields;
	}

	public function set_vat_prices_process_checkout() {
		
		$data = array();
		
		if ( is_checkout() && isset( $_POST['post_data'] ) ) {

			// Parse Array
			parse_str( $_POST['post_data'], $data );

			$address_type = $this->get_vat_address_type_by_checkout_data( $data );

			if ( isset( $data["{$address_type}_vat_id"] ) ) {
				$this->check_vat_exemption( $data );
			}
		}
	}

	public function get_customer_billing_country() {
		if ( is_callable( array( WC()->customer, "get_billing_country" ) ) ) {
			return WC()->customer->get_billing_country();
		} else {
			return WC()->customer->get_country();
		}
	}

	public function check_vat_exemption( $post_data = array() ) {

		WC()->customer->set_is_vat_exempt( false );

		if ( WC()->session ) {
			WC()->session->set( "billing_vat_id", '' );
			WC()->session->set( "shipping_vat_id", '' );
		}

		$customer_country = $this->get_customer_billing_country();
		$address_type     = $this->get_vat_address_type_by_checkout_data( $post_data );

		if ( 'shipping' === $address_type ) {
			$customer_country = WC()->customer->get_shipping_country();
		}

		if ( isset( $post_data["{$address_type}_vat_id"] ) && ! empty( $customer_country ) && ! empty( $post_data["{$address_type}_vat_id"] ) && $this->country_supports_vat_id( $customer_country ) ) {
			
			$vat_id_elements = $this->get_vat_id_from_string( $post_data[ "{$address_type}_vat_id" ], $customer_country );

			if ( $this->validate( $vat_id_elements['country'], $vat_id_elements['number'] ) ) {

				if ( WC()->session ) {
					WC()->session->set( "{$address_type}_vat_id", $vat_id_elements['country'] . $vat_id_elements['number'] );
				}

				$this->set_vat_exempt( $customer_country );
			} else {
				wc_add_notice( __( 'VAT ID seems to be invalid.', 'woocommerce-germanized-pro' ), 'error' );
			}
		}
	}

	public function add_vat_address( $replacements, $args ) {
		extract( $args );
		
		if ( isset( $vat_id ) )
			$replacements['{vat_id}'] = $vat_id;
		else
			$replacements['{vat_id}'] = '';
 		
 		return $replacements;
	}

	public function hide_vat_field_js( $fields ) {
		$fields['vat_id'] = '#billing_vat_id_field, #shipping_vat_id_field';
		return $fields;
	}

	public function country_supports_vat_id( $country ) {
		$supports_vat = false;
		
		if ( WC()->countries->get_base_country() !== $country && in_array( $country, WC()->countries->get_european_union_countries( 'eu_vat' ) ) )
			$supports_vat = true;

		if ( 'yes' === get_option( 'woocommerce_gzdp_vat_id_base_country_included' ) &&  WC()->countries->get_base_country() === $country ) {
			$supports_vat = true;
		}
		
		return apply_filters( 'woocommerce_gzdp_country_supports_vat_id', $supports_vat, $country );
	}

	public function country_supports_vat_exempt( $country ) {
		$supports_vat_exempt = false;

		if ( WC()->countries->get_base_country() !== $country && in_array( $country, WC()->countries->get_european_union_countries( 'eu_vat' ) ) )
			$supports_vat_exempt = true;

		return apply_filters( 'woocommerce_gzdp_country_supports_vat_exempt', $supports_vat_exempt, $country );
	}

	public function hide_vat_field( $locale ) {
		$applyable = array_merge( WC()->countries->get_allowed_countries(), WC()->countries->get_shipping_countries() );

		foreach ( $applyable as $country => $name ) {
			
			if ( ! $this->country_supports_vat_id( $country ) ) {
				
				if ( ! isset( $locale[ $country ] ) )
					$locale[ $country ] = array();
				
				$locale[ $country ]['vat_id'] = array( 'required' => false, 'hidden' => true );
			}
		}

		return $locale;
	}

	public function set_vat_field( $countries ) {
		
		foreach ( $countries as $country => $value ) {
			$countries[ $country ] .= "\n{vat_id}";
		}
		
		return $countries;
	}

	public function add_vat_field( $fields ) {

		$fields['vat_id'] = array(
			'label'       => __( 'VAT ID', 'woocommerce-germanized-pro' ),
			'placeholder' => __( 'VAT ID', 'woocommerce-germanized-pro' ),
			'required'    => $this->vat_field_is_required(),
			'clear'       => true,
			'class'       => array( 'form-row-wide' ),
			'priority'    => 100,
		);

		return $fields;
	}

	public function vat_field_is_required() {
		$is_required = false;

		// Check if VAT ID is not forced
		if ( 'yes' === get_option( 'woocommerce_gzdp_force_virtual_product_business' ) ) {
			// If it is forced check whether current cart contains virtual/downloadable product
			$items = ( WC()->cart ? WC()->cart->get_cart() : array() );

			if ( ! empty( $items ) ) {
				foreach ( $items as $cart_item_key => $values ) {
					$_product = wc_get_product( $values[ 'data' ] );

					if ( $_product->is_downloadable() || $_product->is_virtual() ) {
						$is_required = true;
						break;
					}
				}
			}
		}

		if ( 'yes' === get_option( 'woocommerce_gzdp_vat_id_required' ) ) {
			$is_required = true;
		}

		return apply_filters( 'woocommerce_gzdp_vat_id_field_is_required', $is_required );
	}

	public function validate( $country, $number ) {

		$country = $this->get_vat_id_prefix_by_country( $country );

		if ( get_transient( 'vat_id_validated_' . $country . $number ) )
			return true;

		$vat = new WC_GZDP_VAT_Validation();

		if ( $vat->check( $country, $number ) ) {
			if ( get_option( 'woocommerce_gzdp_vat_check_cache' ) ) {
				$days = (int) get_option( 'woocommerce_gzdp_vat_check_cache', 7 );
				set_transient( 'vat_id_validated_' . $country . $number, 'yes', $days * DAY_IN_SECONDS );
			}

			return true;
		}
		
		return false;

	}

	/**
	 * @param WC_Order $order
	 * @param $data_store
	 */
	public function calc_order_taxes_v3( $order, $data_store ) {
		if ( ! empty( $_POST[ 'action' ] ) && 'woocommerce_calc_line_taxes' === $_POST[ 'action' ] ) {

			$country = ! empty( $_POST[ 'country' ] ) ? wc_clean( $_POST[ 'country' ] ) : WC()->countries->get_base_country();
			$vat_id = ! empty( $_POST[ 'vat_id' ] ) ? wc_clean( $_POST[ 'vat_id' ] ) : '';

			if ( ! empty( $vat_id ) && $this->country_supports_vat_id( $country ) ) {
				$vat_id_elements = $this->get_vat_id_from_string( $vat_id, $country );

				// Is VAT exempt
				if ( WC_GZDP_VAT_Helper::instance()->validate( $vat_id_elements[ 'country' ], $vat_id_elements[ 'number' ] ) ) {
					$order->remove_order_items( 'tax' );
					$order->set_shipping_tax(  0 );
					$order->set_cart_tax( 0 );
				}
			}
		}
	}

	/**
	 * Item filter when manually recalculating order taxes to check for vat id - WC pre 3.X only
	 *  
	 * @param  array $items    
	 * @param  int $order_id 
	 * @param  string $country  
	 * @param  array $data post data
	 * @return array
	 */
	public function calc_order_taxes( $items, $order_id, $country, $data ) {

		remove_filter( 'get_post_metadata', array( $this, 'product_vat_exempt' ), 0 );

		if ( isset( $data[ 'vat_id' ] ) && $this->country_supports_vat_id( $country ) ) {

			$vat_id_elements = $this->get_vat_id_from_string( sanitize_text_field( $data[ 'vat_id' ] ), $country );

			// Is VAT exempt
			if ( WC_GZDP_VAT_Helper::instance()->validate( $vat_id_elements[ 'country' ], $vat_id_elements[ 'number' ] ) ) {
				// Remove product taxable status
				add_filter( 'get_post_metadata', array( $this, 'product_vat_exempt' ), 0, 4 );
				// Remove order taxes
				add_action( 'woocommerce_saved_order_items', array( $this, 'remove_order_vat' ), 0, 2 );
			}
		}
		return $items;
	}

	public function remove_order_vat( $order_id, $items ) {
		$order = wc_get_order( $order_id );
		$order->remove_order_items( 'tax' );
	}

	/**
	 * Temporarily adds a filter to stop products from being taxable - for admin order tax calculation only
	 */
	public function product_vat_exempt( $metadata, $object_id, $meta_key, $single ) {
		if ( '_tax_status' === $meta_key )
			return 'none';
	}

}
return WC_GZDP_VAT_Helper::instance();