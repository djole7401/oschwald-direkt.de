<?php

if ( ! defined( 'ABSPATH' ) )
    exit; // Exit if accessed directly

class WC_GZDP_Invoice_Cancellation_Refund extends WC_GZDP_Invoice_Cancellation {

    public function is_refund() {
        return true;
    }

    public function is_total_refund() {
        if ( ! $this->parent )
            return false;
        elseif ( ! $this->is_refund() )
            return true;

        return ( $this->totals[ 'total' ] * -1 ) === $this->parent->totals[ 'total' ];
    }

    public function get_totals( $tax_display = 'incl', $is_refund = true ) {

        $totals = parent::get_totals( $tax_display, true );

        return $totals;
    }

    public function refresh( $data = array(), $order = NULL ) {

        global $wpdb;

        if ( $this->order )
            $order = wc_get_order( $this->order );

        if ( ( ! isset( $data[ 'invoice_parent' ] ) || empty( $data[ 'invoice_parent' ] ) ) && ! $this->parent )
            return false;

        if ( isset( $data[ 'invoice_parent' ] ) )
            $this->set_parent( absint( $data[ 'invoice_parent' ] ) );

        $this->update_status( 'wc-gzdp-paid' );

        if ( $this->is_locked() && ! isset( $data[ 'invoice_force_rebuilt' ] ) )
            return false;

        // Update Post
        $date = date_i18n( 'Y-m-d H:i:s', strtotime( ( ! empty( $data[ 'invoice_date' ] ) ? $data[ 'invoice_date' ] : false ) ) );
        $wpdb->query( $wpdb->prepare( "UPDATE $wpdb->posts SET post_date = %s, post_date_gmt = %s WHERE ID = %s", $date, get_gmt_from_date( $date ), $this->id ) );

        if ( $order )
        	do_action( 'woocommerce_gzdp_invoice_maybe_update_language', $this, $order );

        if ( $this->parent ) {

            // Update from parent invoice
            update_post_meta( $this->id, '_invoice_address', $this->parent->address );
            update_post_meta( $this->id, '_invoice_recipient', $this->parent->recipient );
            update_post_meta( $this->id, '_invoice_payment_method', $this->parent->payment_method );
            update_post_meta( $this->id, '_invoice_payment_method_title', $this->parent->payment_method_title );
            update_post_meta( $this->id, '_invoice_refund', 'no' );

            update_post_meta( $this->id, '_invoice_order', wc_gzd_get_crud_data( $order, 'id' ) );
            update_post_meta( $this->id, '_invoice_refund', 'yes' );

            update_post_meta( $this->id, '_invoice_currency', $this->parent->currency );


            $items = array();

            foreach( $order->get_items() as $key => $item ) {
                if ( isset( $item[ 'qty' ] ) && $item[ 'qty' ] < 0 ) {
                    $items[ $key ] = $item;

                    if ( $item[ 'qty' ] < 0 ) {
	                    $items[ $key ]['qty'] = $item['qty'] * - 1;
                    }
                }
            }

            if ( empty( $items ) ) {
                $items = apply_filters( 'woocommerce_gzdp_invoice_refund_empty_items', $items, $this );
            }

            update_post_meta( $this->id, '_invoice_items', $items );

            $parent = get_post( wc_gzd_get_crud_data( $order, 'id' ) );
            $parent_order = wc_get_order( $parent->post_parent );

            if ( $tax_totals = $order->get_tax_totals() ) {

                foreach ( $tax_totals as $key => $tax ) {
                    $tax_totals[ $key ]->amount = $tax_totals[ $key ]->amount;
                    $tax_totals[ $key ]->formatted_amount = wc_price( $tax_totals[ $key ]->amount );
                }

                update_post_meta( $this->id, '_invoice_tax_totals', $tax_totals );
            }

            $fee_total = 0;
            foreach ( $order->get_fees() as $item )
                $fee_total += $item['line_total'];

            $subtotal_gross = 0;

            foreach ( $items as $item )
                $subtotal_gross += $order->get_line_total( $item, true, true );

            update_post_meta( $this->id, '_invoice_totals', array(
                'subtotal' => $order->get_subtotal(),
                'subtotal_gross' => $subtotal_gross,
                'shipping' => $order->get_total_shipping(),
                'fee' => $fee_total,
                'discount' => 0,
                'total_before_refund' => 0,
                'refunded' => 0,
                'tax_refunded' => 0,
                'tax' => $order->get_total_tax(),
                'total' => $order->get_total(),
            ) );
        }

        // Invoice Number
        if ( $this->is_new() )
            $this->generate_number();

        if ( $order ) {

            $parent = get_post( wc_gzd_get_crud_data( $order, 'id' ) );
            $order = wc_get_order( $parent->post_parent );

            $this->refresh_order_invoices( $order );
        }

        $this->populate();

        $file = $this->generate_pdf();
        $this->save_attachment( $file );
    }

    public function get_submit_button_text() {
        return ( $this->is_new() ? sprintf( __( 'Cancel %s', 'woocommerce-germanized-pro' ), $this->parent->get_title() ) : __( 'Regenerate Cancellation', 'woocommerce-germanized-pro' ) );
    }
}