<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

class WC_GZDP_Invoice extends WC_GZDP_Post_PDF {

	public function __construct( $invoice ) {
		parent::__construct( $invoice );
		$this->content_type = 'invoice';
		$this->type = 'simple';
	}

	public function is_cancellation() {
		return $this->is_type( 'cancellation' );
	}

	public function get_address() {
		return $this->address;
	}

	public function is_cancelled() {
		return ( $this->get_status( true ) == 'cancelled' ? true : false );
	}

	public function is_partially_refunded() {

	    if ( ! $this->get_order() ) {
	        return false;
        }

        $total = wc_gzdp_get_invoice_total_refunded_amount( $this );

	    return $total < 0;
    }

	public function get_submit_button_text() {
		return ( $this->is_new() ? __( 'Generate Invoice', 'woocommerce-germanized-pro' ) : __( 'Regenerate Invoice', 'woocommerce-germanized-pro' ) );
	}

	public function get_sender_address( $type = '' ) {
		return ( $this->get_option( 'address' . ( ! empty( $type ) ? '_' . $type : '' ) ) ? explode( "\n", $this->get_option( 'address' . ( ! empty( $type ) ? '_' . $type : '' ) ) ) : array() );
	}

	public function get_number() {
		$number = $this->number;
		if ( ! $this->number )
			$number = __( 'X', 'woocommerce-germanized-pro' );
		return $number;
	}

	public function has_number() {
		$number = $this->number;
		return ( ( ! $number || empty( $number ) ) ? false : true );
	}

	public function get_title( $html = false ) {
		$type = wc_gzdp_get_invoice_types( $this->type );
		$format = $this->get_option( 'number_format', '' );
		$number = $this->number_formatted;
		
		if ( ! $number || empty( $number ) )
			$number = $this->number_format( $format );
		
		if ( $html )
			$number = str_replace( $type[ 'title' ], '<span class="invoice-desc">' . $type[ 'title' ] . '</span>', $number );
		
		return apply_filters( 'woocommerce_gzdp_invoice_title', $number, $this, $html );
	}

	public function number_format( $format ) {
		$type = wc_gzdp_get_invoice_types( $this->type );
		return str_replace( 
			array( 
				'{type}', 
				'{number}',
				'{order_number}',
				'{d}', 
				'{m}', 
				'{y}'
			), 
			array( 
				$type[ 'title' ], 
				( $this->get_option( 'number_leading_zeros' ) ? str_pad( $this->get_number(), absint( $this->get_option( 'number_leading_zeros' ) ), '0', STR_PAD_LEFT ) : $this->get_number() ), 
				$this->get_order_number(),
				$this->get_date( 'd' ), 
				$this->get_date( 'm' ),
				$this->get_date( 'Y' ) 
			), 
			$format 
		);
	}

	public function get_status( $readable = false ) {
		return ( $readable ? str_replace( 'wc-gzdp-', '', $this->post->post_status ) : $this->post->post_status );
	}

	public function is_delivered() {
		return ( $this->delivered ? true : false );
	}

	public function get_delivery_date( $format = 'd.m.Y H:i' ) {
	 	return ( $this->delivery_date ? date_i18n( $format, strtotime( $this->delivery_date ) ) : false );
	}

	public function is_new() {
		return ( $this->has_number() ? false : true );
	}

	public function is_locked() {
		return ( $this->locked ? true : false );
	}

	public function get_email_class() {
		return 'WC_GZDP_Email_Customer_Invoice_' . ucfirst( $this->type );
	}

	public function filter_export_data( $data = array() ) {
		return $data;
	}

	public function send_to_customer() {
	    $mailer = WC()->mailer();

	    foreach ( $mailer->get_emails() as $key => $mail ) {
            if ( $key == $this->get_email_class() )
				$mail->trigger( $this );
		}
		$this->mark_as_sent();
	}

	public function mark_as_sent() {
		update_post_meta( $this->id, '_invoice_delivered', true );
		update_post_meta( $this->id, '_invoice_delivery_date', current_time( 'mysql' ) );
		update_post_meta( $this->id, '_invoice_locked', true );
	}

	public function get_summary() {
		return sprintf( __( 'Total Invoice Amount: %s', 'woocommerce-germanized-pro' ), wc_price( $this->totals[ 'total' ] ) );
	}

	public function get_order_number() {
		return ( $this->order_number ? $this->order_number : $this->order );
	}

	public function update_status( $status = '' ) {
		
		$org_status = $status;
		$status = str_replace( 'wc-gzdp-', '', $status );

		if ( empty( $status ) || $this->get_status( true ) == $status )
			return false;
		
		global $wpdb;
		$wpdb->query( $wpdb->prepare( "UPDATE $wpdb->posts SET post_status = %s WHERE ID = %s", "wc-gzdp-" . $status, $this->id ) );

		do_action( 'wc_gzdp_invoice_status_changed', $this, $this->id );
		do_action( 'wc_gzdp_invoice_status_changed_to_' . $status, $this, $this->id );
		do_action( 'wc_gzdp_invoice_status_changed_from_' . $this->get_status( true ) . '_to_' . $status, $this, $this->id );

		$this->populate();
		$this->post->post_status = $org_status;

	}

	public function refresh_post_data( $data = array(), $order ) {

		global $wpdb;

		$date = date_i18n( 'Y-m-d H:i:s' );
		
		if ( isset( $data[ 'invoice_date' ] ) && ! empty( $data[ 'invoice_date' ] ) )
			$date = $data[ 'invoice_date' ];

		$wpdb->query( $wpdb->prepare( "UPDATE $wpdb->posts SET post_date = %s, post_date_gmt = %s WHERE ID = %s", $date, get_gmt_from_date( $date ), $this->id ) );

		$this->populate();
	}

	public function get_order() {
		$order = $this->order;
		
		if ( ! is_object( $order ) )
			$order = wc_get_order( $order );
	
		return $order;
	}

	public function get_totals( $tax_display = 'incl' ) {

		$order = $this->get_order();

		$totals = array();

		if ( ! $order )
			return $totals;

		$totals = $order->get_order_item_totals( $tax_display );

		// Fix Little Woo Bug which double checks for parameter and order excl. tax display attribute
		if ( 'excl' === $tax_display ) {
			if ( isset( $totals[ 'discount' ] ) ) {
				$totals[ 'discount' ][ 'value' ] = '-' . apply_filters( 'woocommerce_order_discount_to_display', wc_price( $order->get_total_discount( true ), array( 'currency' => wc_gzd_get_order_currency( $order ) ) ), $order );
			}
		}

		$fees = array();
		$refunds = array();
		$unknown = array();

		if ( get_option( 'woocommerce_gzdp_invoice_column_based_discounts' ) === 'yes' ) {
			if ( isset( $totals['discount'] ) ) {
				unset( $totals['discount'] );
			}
		}

		if ( 'excl' === $tax_display ) {
			$key_order = apply_filters( 'woocommerce_gzdp_invoice_totals_excluding_tax_order', array(
				'cart_subtotal',
				'discount',
				'fee',
				'shipping',
                'refund',
				'unknown',
				'net_price',
				'tax',
				'order_total',
			), $this );
		} else {
			$key_order = apply_filters( 'woocommerce_gzdp_invoice_totals_order', array(
				'cart_subtotal',
				'discount',
				'fee',
				'shipping',
                'refund',
				'unknown',
				'order_total',
				'net_price',
				'tax',
			), $this );
		}

		$ignored = array( 'payment_method' );

		// Ignore tax keys and do not add them to unknown items
		if ( $order->get_tax_totals() ) {
			foreach( $order->get_tax_totals() as $code => $tax ) {
				array_push( $ignored, sanitize_title( $code ) );
			}
		}

		$ignored = apply_filters( 'woocommerce_gzdp_invoice_totals_unknown_ignored', $ignored, $this );

		foreach ( $totals as $key => $total ) {

			$total[ 'label' ] = ( substr( $total[ 'label' ], -1 ) === ':' ? substr( $total[ 'label' ], 0, -1 ) : $total[ 'label' ] );
			$total[ 'key' ] = $key;

			// override changes
			$totals[ $key ] = $total;

			if ( strpos( $key, 'fee_' ) !== false ) {
				$total[ 'key' ] = $key;
				array_push( $fees, $total );
			} elseif ( strpos( $key, 'refund_' ) !== false ) {
				$total['key'] = $key;
				array_push( $refunds, $total );
			} elseif ( strpos( $key, 'tax_' ) !== false ) {
				continue;
			} elseif ( ! in_array( $key, $key_order ) && ! in_array( $key, $ignored ) ) {
				$total[ 'key' ] = $key;
				array_push( $unknown, $total );
			}
		}

		$net_total = $this->totals[ 'total' ] - wc_round_tax_total( $this->totals[ 'tax' ] );

		// e.g. when using vouchers
		if ( $net_total < 0 && $this->type !== 'cancellation' ) {
			$net_total = 0;
		}

		// Check for coupons
		if ( class_exists( "WC_GZD_Coupon_Helper" ) && WC_GZD_Coupon_Helper::instance()->order_has_voucher( $order ) ) {

			$net_total = ( $this->totals[ 'total' ] + $order->get_total_discount( 'incl' ) ) - $this->totals[ 'tax' ];

			$key_order = apply_filters( 'woocommerce_gzdp_invoice_totals_voucher_order', array(
				'cart_subtotal',
				'fee',
				'shipping',
				'net_price',
				'tax',
				'discount',
				'refund',
				'unknown',
				'order_total',
			), $this );
		}

		$totals[ 'net_price' ] = array(
			'key' => 'net_price',
			'label' => __( 'Total net', 'woocommerce-germanized-pro' ),
			'value' => wc_price( $net_total, array( 'currency' => $this->currency ) ),
			'invoice_data' => true,
		);

		if ( isset( $totals[ 'order_total' ] ) ) {
			$totals[ 'order_total' ][ 'value' ] = wc_price( $this->totals[ 'total' ], array( 'currency' => $this->currency ) );
			$totals[ 'order_total' ][ 'invoice_data' ] = true;
			$totals[ 'order_total' ][ 'classes' ] = array( 'footer-total' );
		}

		if ( isset( $totals[ 'cart_subtotal' ] ) ) {
			$totals[ 'cart_subtotal' ][ 'classes' ] = array( 'footer-first' );

			if ( get_option( 'woocommerce_gzdp_invoice_column_based_discounts' ) === 'yes' ) {
				$subtotal = 0;

				foreach ( $order->get_items() as $item ) {
					$subtotal += ( is_array( $item ) ) ? $item['line_subtotal'] : $item->get_subtotal();

					if ( 'incl' === $tax_display ) {
						$subtotal += ( is_array( $item ) ) ? $item['line_subtotal_tax'] : $item->get_subtotal_tax();
					}
				}

				$totals[ 'cart_subtotal' ][ 'value' ] = wc_price( $subtotal - $order->get_total_discount( $tax_display !== 'incl' ), array( 'currency' => $this->currency ) );
			}
		}

		$taxes = array();

		if ( $this->tax_totals ) {
			foreach ( $this->tax_totals as $code => $tax ) {
				array_push( $taxes, array(
					'key' => 'tax_' . $tax->rate_id,
					'label' => wc_gzdp_get_tax_label( $tax->rate_id ),
					'value' => wc_price( wc_round_tax_total( $tax->amount ), array( 'currency' => $this->currency ) ),
					'invoice_data' => true,
				) );
			}
		}

		$totals_ordered = array();

		foreach ( $key_order as $key ) {
			if ( isset( $totals[ $key ] ) && ! empty( $totals[ $key ] ) ) {
				$totals_ordered[] = $totals[ $key ];
			} else if ( ! empty( $fees ) && strpos( $key, 'fee' ) !== false ) {
				$totals_ordered = array_merge( $totals_ordered, $fees );
			} else if ( ! empty( $taxes ) && strpos( $key, 'tax' ) !== false ) {
				$totals_ordered = array_merge( $totals_ordered, $taxes );
			} else if ( ! empty( $refunds ) && strpos( $key, 'refund' ) !== false ) {
                $totals_ordered = array_merge( $totals_ordered, $refunds );
            } else if ( ! empty( $unknown ) && 'unknown' === $key ) {
				$totals_ordered = array_merge( $totals_ordered, $unknown );
			}
		}

		return apply_filters( 'woocommerce_gzdp_invoice_totals', $totals_ordered, $totals, $this );
	}

	public function refresh( $data = array(), $order = NULL ) {
		
		global $wpdb;
		
		$this->populate();

		$data = apply_filters( 'woocommerce_gzdp_invoice_refresh_data', $data, $this );

		$status = ( ! empty( $data[ 'invoice_status' ] ) ? $data[ 'invoice_status' ] : $this->get_status() );
		$this->update_status( $status );
		
		if ( $this->is_locked() && ! isset( $data[ 'invoice_force_rebuilt' ] ) )
			return false;
		
		if ( ! is_object( $order ) && $this->order )
			$order = wc_get_order( $this->order );

		do_action( 'woocommerce_gzdp_invoice_maybe_update_language', $this, $order );
		
		// Update Post
		$this->refresh_post_data( $data, $order );
		
		// Update Meta
		delete_post_meta( $this->id, '_invoice_tax_totals' );
		delete_post_meta( $this->id, '_invoice_fee_totals' );
		delete_post_meta( $this->id, '_invoice_refunds' );

		update_post_meta( $this->id, '_invoice_address', $order->get_formatted_billing_address() );
		update_post_meta( $this->id, '_invoice_shipping_address', $order->get_formatted_shipping_address() );
		update_post_meta( $this->id, '_invoice_recipient', array( 'firstname' => wc_gzd_get_crud_data( $order, 'billing_first_name' ), 'lastname' => wc_gzd_get_crud_data( $order, 'billing_last_name' ), 'mail' => wc_gzd_get_crud_data( $order, 'billing_email' ) ) );
		update_post_meta( $this->id, '_invoice_items', $order->get_items() );
		update_post_meta( $this->id, '_invoice_currency', wc_gzd_get_order_currency( $order ) );
		
		if ( $order->get_tax_totals() ) {
			$tax_totals = $order->get_tax_totals();
			foreach ( $tax_totals as $key => $tax ) {
				$tax_totals[ $key ]->amount = $tax_totals[ $key ]->amount - $order->get_total_tax_refunded_by_rate_id( $tax->rate_id );
				$tax_totals[ $key ]->formatted_amount = wc_price( $tax_totals[ $key ]->amount );
			}
			update_post_meta( $this->id, '_invoice_tax_totals', $tax_totals );
		}
		if ( $order->get_items( 'fee' ) )
			update_post_meta( $this->id, '_invoice_fee_totals', $order->get_items( 'fee' ) );
		if ( $order->get_refunds() )
			update_post_meta( $this->id, '_invoice_refunds', $order->get_refunds() );
		
		update_post_meta( $this->id, '_invoice_payment_method', wc_gzd_get_crud_data( $order, 'payment_method' ) );
		update_post_meta( $this->id, '_invoice_payment_method_title', wc_gzd_get_crud_data( $order, 'payment_method_title' ) );

		$fee_total = 0;
		foreach ( $order->get_fees() as $item )
			$fee_total += $item['line_total'];

		$subtotal_gross = 0;
		foreach ( $order->get_items() as $item )
			$subtotal_gross += $order->get_line_total( $item, true, true );

		update_post_meta( $this->id, '_invoice_totals', array( 
			'subtotal' => $order->get_subtotal(),
			'subtotal_gross' => $subtotal_gross,
			'shipping' => $order->get_total_shipping(),
			'fee' => $fee_total,
			'discount' => ( $order->get_total_discount() ? $order->get_total_discount() * -1 : 0 ),
			'total_before_refund' => $order->get_total(),
			'refunded' => ( $order->get_total_refunded() ? ( $order->get_total_refunded() - $order->get_total_tax_refunded() ) * -1 : 0 ), 
			'tax_refunded' => ( $order->get_total_tax_refunded() ? $order->get_total_tax_refunded() * -1 : 0 ), 
			'tax' => $order->get_total_tax() - $order->get_total_tax_refunded(), 
			'total' => ( $order->get_total() - $order->get_total_refunded() ),
		) );

		update_post_meta( $this->id, '_invoice_order', wc_gzd_get_crud_data( $order, 'id' ) );
		update_post_meta( $this->id, '_invoice_order_number', $order->get_order_number() );
		update_post_meta( $this->id, '_invoice_order_data', array( 'date' => wc_gzd_get_crud_data( $order, 'order_date' ) ) );
		
		// Invoice Number
		if ( $this->is_new() )
			$this->generate_number();

		do_action( 'woocommerce_gzdp_before_invoice_refresh', $this );
		
		$this->refresh_order_invoices( $order );
		parent::refresh();
	}

	protected function generate_number() {
		global $wpdb;
		$number = wc_gzdp_get_next_invoice_number( $this->type );
		update_post_meta( $this->id, '_invoice_number', $number );
		update_post_meta( $this->id, '_invoice_number_formatted', $this->get_title() );
		// Update Post Title
		$wpdb->query( $wpdb->prepare( "UPDATE $wpdb->posts SET post_title = %s WHERE ID = %s", $this->get_title(), $this->id ) );
	}

	public function refresh_order_invoices( $order ) {

	    $order_invoices = get_post_meta( wc_gzd_get_crud_data( $order, 'id' ), '_invoices', true );

	    if ( $order_invoices && ! in_array( $this->id, $order_invoices ) )
			array_push( $order_invoices, $this->id );
		else if ( ! $order_invoices )
			$order_invoices = array( $this->id );

		// Clear order cache
        if ( method_exists( $order, 'save_meta_data' ) ) {
            $order->update_meta_data( '_invoices', $order_invoices );
            $order->save_meta_data();
        } else {
            update_post_meta( wc_gzd_get_crud_data( $order, 'id' ), '_invoices', $order_invoices );
        }
	}

	public function delete( $bypass_trash = false ) {
		if ( $this->order ) {
			$invoices = get_post_meta( $this->order, '_invoices', true );
			if ( ! empty( $invoices ) ) {
				foreach ( $invoices as $key => $invoice ) {
					if ( $invoice == $this->id )
						unset( $invoices[ $key ] );
				}
				$invoices = array_values( $invoices );
				if ( ! empty( $invoices ) )
					update_post_meta( $this->order, '_invoices', $invoices );
				else
					delete_post_meta( $this->order, '_invoices' );
			}
		}
		parent::delete( $bypass_trash );
	}

}

?>