<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

function wc_gzdp_get_invoice_types( $type = '' ) {
	$types = array(
		'simple' => array(
			'class_name' => 'WC_GZDP_Invoice_Simple',
			'title'	=> _x( 'Invoice', 'invoices', 'woocommerce-germanized-pro' ),
			'title_new' => _x( 'New invoice', 'invoices', 'woocommerce-germanized-pro' ),
			'manual' => false,
		),
		'cancellation' => array(
			'class_name' => 'WC_GZDP_Invoice_Cancellation',
			'title'	=> _x( 'Cancellation', 'invoices', 'woocommerce-germanized-pro' ),
			'title_new' => _x( 'New cancellation', 'invoices', 'woocommerce-germanized-pro' ),
			'manual' => true,
		),
		'packing_slip' => array(
			'class_name' => 'WC_GZDP_Invoice_Packing_Slip',
			'title' => _x( 'Packing Slip', 'invoices', 'woocommerce-germanized-pro' ),
			'title_new' => _x( 'New packing slip', 'invoices', 'woocommerce-germanized-pro' ),
			'manual' => false,
		),
	);
	if ( empty( $type ) )
		return $types;
	return ( isset( $types[ $type ] ) ? $types[ $type ] : $types[ 'simple' ] );
}

function wc_gzdp_get_default_invoice_status() {
	return apply_filters( 'woocommerce_gzdp_default_invoice_status', get_option( 'woocommerce_gzdp_invoice_default_status', 'wc-gzdp-pending' ) );
}

function wc_gzdp_get_invoice_statuses() {
	return array( 
		'wc-gzdp-pending' => _x( 'Pending', 'invoices', 'woocommerce-germanized-pro' ), 
		'wc-gzdp-paid' => _x( 'Paid', 'invoices', 'woocommerce-germanized-pro' ),  
		'wc-gzdp-cancelled' => _x( 'Cancelled', 'invoices', 'woocommerce-germanized-pro' ), 
	);
}

function wc_gzdp_get_next_invoice_number( $type ) {

	global $wpdb;
	
	$types = wc_gzdp_get_invoice_types();
	
	if ( ! isset( $types[ $type ] ) )
		return false;
	
	if ( $type == 'cancellation' && get_option( 'woocommerce_gzdp_invoice_cancellation_numbering' ) == 'no' )
		$type = 'simple';

	do_action( 'woocommerce_gzdp_get_next_invoice_number' );

	// Clear cache
	$wpdb->flush();

	// Udpate
	$update = $wpdb->query( $wpdb->prepare( "UPDATE $wpdb->options SET option_value=option_value+1 WHERE option_name = %s", "wc_gzdp_invoice_" . $type ) );

	// Get next
	$next = $wpdb->get_var( $wpdb->prepare( "SELECT option_value FROM $wpdb->options WHERE option_name = %s", "wc_gzdp_invoice_" . $type ) );

	return (int) $next;
}

function wc_gzdp_get_tax_label( $rate_id ) {
	return sprintf( __( 'VAT %s', 'woocommerce-germanized-pro' ), WC_Tax::get_rate_percent( $rate_id ) );
}

function wc_gzdp_order_has_invoice_type( $order, $type = 'simple' ) {
	
	$found = false;
	$invoices = wc_gzdp_get_invoices_by_order( $order );
	
	if ( ! empty( $invoices ) ) {
	
		foreach ( $invoices as $invoice ) {
			
			if ( $invoice->is_type( $type ) )
				$found = true;

		}

	}
	return $found;
}

function wc_gzdp_order_supports_new_invoice( $order ) {

 	$invoices = wc_gzdp_get_invoices_by_order( $order, 'simple' );
 	$supports_new = true;

	if ( ! empty( $invoices ) ) {
	
		foreach ( $invoices as $invoice ) {
			
			if ( ! $invoice->is_cancelled() )
				$supports_new = false;

		}

	}

	return $supports_new;

}

function wc_gzdp_get_invoices_by_order( $order, $type = false ) {
	
	$return = array();

	// Make sure we have latest meta loaded
	if ( $order && method_exists( $order, 'read_meta_data' ) ) {
        $order->read_meta_data( true );
    }

	if ( $order && wc_gzd_get_crud_data( $order, 'invoices' ) ) {
		foreach ( wc_gzd_get_crud_data( $order, 'invoices' ) as $invoice ) {
			
			$invoice_obj = wc_gzdp_get_invoice( $invoice );
			
			if ( ! $invoice_obj || ! is_object( $invoice_obj ) )
				continue;

			if ( $type && ! $invoice_obj->is_type( $type ) )
				continue;
			
			$return[ $invoice ] = $invoice_obj;
		}
	}

	return $return;
}

function wc_gzdp_get_order_last_invoice( $order ) {

	$invoices = wc_gzdp_get_invoices_by_order( $order, 'simple' );
	$best_match = null;

	foreach ( $invoices as $invoice ) {

		if ( ! $invoice->is_cancelled() )
			$best_match = $invoice;

	}

	if ( is_null( $best_match ) && ! empty( $invoices ) )
		$best_match = end( $invoices );

	return $best_match;

}

function wc_gzdp_is_invoice( $invoice ) {
	return $invoice instanceof WC_GZDP_Invoice;
}

function wc_gzdp_get_invoice_download_url( $invoice_id ) {
	return wc_get_endpoint_url( 'view-bill', $invoice_id, get_permalink( wc_get_page_id( 'myaccount' ) ) );
}

function wc_gzdp_get_invoice( $invoice = false, $type = 'simple' ) {
	return WC_germanized_pro()->invoice_factory->get_invoice( $invoice, $type );
}

function wc_gzdp_get_invoice_frontend_types() {
	$types = get_option( 'woocommerce_gzdp_invoice_download_frontend_types' );
	return ( empty( $types ) ? false : (array) $types );
}

function wc_gzdp_get_invoice_total_refunded_amount( $invoice ) {

    $invoice_query = new WP_Query(
        array(
            'post_type' => 'invoice',
            'posts_per_page' => -1,
            'post_status' => array( 'wc-gzdp-paid' ),
            'meta_query' => array(
                array(
                    'key'     => '_invoice_parent_id',
                    'value'   => $invoice->id,
                    'compare' => '=',
                ),
                array(
                    'key'     => '_subtype',
                    'value'   => 'refund',
                    'compare' => '=',
                )
            ),
        )
    );

    $total = 0;

    if ( $invoice_query->posts ) {
        foreach( $invoice_query->posts as $post ) {
            $cancellation = wc_gzdp_get_invoice( $post->ID );
            if ( $cancellation ) {
                $total += $cancellation->totals[ 'total' ];
            }
        }
    }

    return wc_format_decimal( $total, 2 );
}

function wc_gzdp_invoice_fully_refunded( $invoice ) {

    $refunded_amount = wc_format_decimal( wc_gzdp_get_invoice_total_refunded_amount( $invoice ) * -1, 2 );
    $total_amount = wc_format_decimal( $invoice->totals[ 'total' ], 2 );

    $formatted = wc_format_decimal( $total_amount - $refunded_amount );

    return ( $formatted <= 0 );
}

function wc_gzdp_get_order_meta( $product, $item ) {

	if ( version_compare( WC()->version, '2.4', '<' ) )
		$item = $item['item_meta'];

	if ( ! isset( $item['item_meta'] ) ) {
	    return (object) array( 'meta' => false );
    }

	$meta = new WC_Order_Item_Meta( $item, $product );
	return $meta;
}

function wc_gzdp_get_order_meta_print( $product, $item ) {
	$print = '';

	if ( WC_GZDP_Dependencies::instance()->woocommerce_version_supports_crud() ) {
		if ( is_a( $item, 'WC_Order_Item' ) ) {
			$print = strip_tags( wc_display_item_meta( $item, array(
				'echo' => false,
				'before' => '',
				'after' => '',
				'separator' => ', ',
				'autop' => false,
			) ) );
		}
	} else {
		if ( $product ) {
			$meta = wc_gzdp_get_order_meta( $product, $item );
			if ( $meta->meta )
				$print = $meta->display( true, true, '_', ", " );
		}
	}

	return apply_filters( 'woocommerce_gzdp_invoice_order_meta_html', $print, $product, $item );
}

function wc_gzdp_get_order_item_tax_rate( $item, $order ) {

	if ( wc_tax_enabled() ) {
		
		$order_taxes         = $order->get_taxes();
		$taxes 				 = array();

		foreach ( $order_taxes as $tax ) {
			$class = wc_get_tax_class_by_tax_id( $tax['rate_id'] );
			$taxes[ $class ] = $tax;
			$percent = wc_gzd_format_tax_rate_percentage( WC_Tax::get_rate_percent( $tax['rate_id'] ) );
			$taxes[ $class ][ 'percent' ] = wc_format_decimal( $percent );
		}

	}

	if ( ! empty( $item['line_tax' ] ) && isset( $item['tax_class'] ) && isset( $taxes[ $item['tax_class'] ] ) ) {
	
		return apply_filters( 'woocommerce_gzdp_invoice_item_tax_rate_html', $taxes[ $item['tax_class'] ][ 'percent' ] . '%', $item, $order );
	
	} else if ( ! empty( $item['line_tax' ] ) ) {
		
		$_product  = apply_filters( 'woocommerce_order_item_product', $order->get_product_from_item( $item ), $item );
		
		if ( $_product ) {
			
			$rates = WC_Tax::get_rates( $_product->get_tax_class() );
			
			if ( ! empty( $rates ) ) {
				$tax_rate = reset( $rates );
				return apply_filters( 'woocommerce_gzdp_invoice_item_product_tax_rate_html', wc_gzd_format_tax_rate_percentage( $tax_rate[ 'rate' ] ) . '%', $item, $order );
			}
		}
	}

	return apply_filters( 'woocommerce_gzdp_invoice_item_no_tax_rate_html', wc_gzd_format_tax_rate_percentage( 0 ) . '%', $item, $order );
}

function wc_gzdp_get_invoice_unit_price_excl( $cart_item ) {
	if ( isset( $cart_item[ 'unit_price_excl' ] ) )
		return $cart_item[ 'unit_price_excl' ];
	return false;
}

function wc_gzdp_invoice_order_price( $price, $invoice ) {
	
	if ( is_numeric( $invoice ) )
		$invoice = wc_gzdp_get_invoice( $invoice );
	
	if ( $invoice->is_cancellation() )
		$price = $price * -1;
	
	return $price;
}

function wc_gzdp_get_invoice_quantity( $item ) {
	$quantity = ( isset( $item[ 'quantity' ] ) ? $item[ 'quantity' ] : $item[ 'qty' ] );
	return ( $quantity < 0 ? $quantity * -1 : $quantity );
}

function wc_gzdp_get_invoice_default_author() {
	$user = wp_get_current_user();
	$user_id = 1;

	// If no user is logged in or current logged in user is not an administrator, look for the admin as post_author
	if ( ! $user || ( $user && ! in_array( 'administrator', $user->roles ) ) ) {

		$admin_mail = get_option( 'admin_email' );

		// Get site admin email address if it is a multiste
		if ( function_exists( 'is_multisite' ) && is_multisite() ) {
			$admin_mail = get_site_option( 'admin_email' );
		}

		$user = get_user_by( 'email', $admin_mail );

		if ( $user ) {
			$user_id = $user->ID;
		}

	} else {
		$user_id = $user->ID;
	}

	return $user_id;
}

function wc_gzdp_get_invoice_item_total_discount( $item, $tax_display = 'incl' ) {
	$args = array(
		'subtotal',
		'subtotal_tax',
		'total',
		'total_tax'
	);

	if ( is_array( $item ) ) {
		$args['subtotal']     = $item['line_subtotal'];
		$args['subtotal_tax'] = $item['line_subtotal_tax'];
		$args['total']        = $item['line_total'];
		$args['total_tax']    = $item['line_tax'];
	} else {
		$args['subtotal']     = $item->get_subtotal();
		$args['subtotal_tax'] = $item->get_subtotal_tax();
		$args['total']        = $item->get_total();
		$args['total_tax']    = $item->get_total_tax();
	}

	$total_discount = $args['subtotal'];

	if ( 'incl' === $tax_display ) {
		$total_discount += $args['subtotal_tax'];
	}

	$total_discount -= $args['total'];

	if ( 'incl' === $tax_display ) {
		$total_discount -= $args['total_tax'];
	}

	return wc_format_decimal( $total_discount, '' );
}
