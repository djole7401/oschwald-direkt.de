<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

class WC_GZDP_Admin_Invoice_Export {

	public $data_type = 'csv';
	public $query_args = array();
	public $query = null;
	public $filename = '';
	public $metas = array();
	public $columns = array();

	public function __construct( $args = array() ) {
		$this->set_query( $args );
		$this->set_metas();
		$this->set_filename();
		$this->set_header();
		$this->output();
	}

	public function set_header( $content_type = 'text/csv' ) {
		header( 'Content-Description: File Transfer' );
		header( 'Content-Disposition: attachment; filename=' . $this->filename );
		header( 'Content-Type: ' . $content_type . '; charset=' . $this->get_charset(), true );
		header( 'Cache-Control: no-cache, no-store, must-revalidate' ); 
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );
	}

	public function get_charset() {
		return apply_filters( 'woocommerce_gzdp_invoice_export_charset', 'Windows-1252' );
	}

	public function output() {

		do_action( 'wc_gzdp_before_invoice_export_output' );
		$data = array();
		
		if ( $this->query->have_posts() ) {
			
			$this->set_columns( $this->query->posts );

			while( $this->query->have_posts() ) {
				$this->query->the_post();
				global $post;
				
				$invoice = WC_Germanized_Pro()->invoice_factory->get_invoice( $post );
				$data[ $invoice->id ] = $this->get_export_data( $invoice );
			}
		}

		$write = $this->prepare( $data );
	   	$df = fopen( "php://output", 'w' );
	   	
	   	if ( ! empty( $write ) )
	   		fputcsv( $df, array_keys( reset( $data ) ) );
		
		foreach ( $write as $row )
			fwrite( $df, $row );
	   	
	   	fclose( $df );
	}

	public function set_columns( $posts ) {

		$this->columns = array(
		    'id',
			'type',
			'date',
			'delivered',
			'address',
			'customer',
			'status',
            'parent',
		);

		$ignore_keys = apply_filters( 'woocommerce_gzdp_invoice_export_ignore_columns', array(
			'tax',
		), $this );

		foreach ( $this->metas as $meta ) {
			if ( ! in_array( $meta, $this->columns ) && ! in_array( $meta, $ignore_keys ) )
				array_push( $this->columns, $meta );
		}
			

		foreach( $posts as $post ) {

			$invoice = wc_gzdp_get_invoice( $post );

			$totals = $invoice->totals;
			$tax_totals = $invoice->tax_totals;

			foreach( $totals as $key => $total ) {
				if ( ! in_array( $key, $this->columns ) && ! in_array( $key, $ignore_keys ) )
					array_push( $this->columns, $key );
			}

			if ( ! empty( $tax_totals ) ) {
				foreach ( $tax_totals as $key => $rate ) {
					
					$column_key = 'tax_' . absint( WC_Tax::get_rate_percent( $rate->rate_id ) );
					
					if ( ! in_array( $column_key, $this->columns ) && ! in_array( $column_key, $ignore_keys ) )
						array_push( $this->columns, $column_key );
				}
			}
		}

		$this->columns = apply_filters( 'woocommerce_gzdp_invoice_export_columns', $this->columns, $posts );
	}

	public function prepare( $row ) {
		foreach ( $row as $key => $row_data ) {
			foreach ( $row_data as $rkey => $rvalue )
				$row[ $key ][ $rkey ] = $this->encode( '"'. str_replace('"', '\"', $rvalue ) .'"' );
			$row[ $key ] = implode( ",", $row[ $key ] ) . "\n";
		}
		return $row;
	}

	public function get_export_data( WC_GZDP_Invoice $invoice ) {
		$type = wc_gzdp_get_invoice_types( $invoice->type );
		
		$totals = $invoice->totals;
		$tax_totals = $invoice->tax_totals;

		$status = '';
		
		foreach ( wc_gzdp_get_invoice_statuses() as $key => $val ) {
			if ( $key == $invoice->get_status() )
				$status = $val;
		}
		
		$order = $invoice->get_order();
		
		$return = array(
		    'id' => $invoice->id,
			'type' => $type[ 'title' ],
			'date' => $invoice->get_date( get_option( 'woocommerce_gzdp_invoice_date_format' ) ),
			'delivered' => ( $invoice->is_delivered() ? $invoice->get_delivery_date() : _x( 'no', 'invoices', 'woocommerce-germanized-pro' ) ),
			'address' => str_replace( '<br/>', ";", $invoice->get_address() ),
			'customer' => ( $order ? wc_gzd_get_crud_data( $order, 'user_id' ) : '' ),
			'status' => $status,
            'parent' => $invoice->parent_id
		);
		
		foreach ( $totals as $key => $total )
			$return[ $key ] = wc_format_decimal( $total, ( apply_filters( 'wocommerce_gzdp_round_csv_export_total', true ) === true ? '' : false ), true );

		if ( ! empty( $tax_totals ) ) {
			foreach ( $tax_totals as $key => $rate ) {
				$return[ 'tax_' . absint( WC_Tax::get_rate_percent( $rate->rate_id ) ) ] = wc_format_decimal( $rate->amount, ( apply_filters( 'wocommerce_gzdp_round_csv_export_tax_total', false ) === true ? '' : false ), true );
			}
		}

		foreach ( $this->metas as $meta )
			$return[ $meta ] = $invoice->$meta;

		$return = $invoice->filter_export_data( $return );

		$column_data = array();

		foreach ( $this->columns as $column_key ) {
			$column_data[ $column_key ] = '';
			
			if ( isset( $return[ $column_key ] ) )
				$column_data[ $column_key ] = $return[ $column_key ];
		}

		return apply_filters( 'woocommerce_gzdp_invoice_export_invoice_data', $column_data, $invoice );
	}

	public function encode( $string ) {
		return iconv( get_option( 'blog_charset' ), $this->get_charset(), $string );
	}

	public function set_filename() {
		$this->filename = 'invoice-' . date( 'Y-m-d' ) . '.' . $this->data_type;
	}

	public function set_metas() {
		$this->metas = apply_filters( 'wc_gzdp_invoice_export_metas', array(
			'currency',
			'payment_method',
			'payment_method_title',
			'order',
			'number',
			'number_formatted',
			'attachment',
		) );
	}

	private function set_query( $args = array() ) {
		$this->query_args = array(
			'posts_per_page' => -1,
			'post_type' => 'invoice',
			'orderby' => 'date',
			'order' => 'ASC',
			'post_status' => array(),
		);
		foreach ( wc_gzdp_get_invoice_statuses() as $status => $val )
			array_push( $this->query_args[ 'post_status' ], $status );
		if ( $args[ 'status' ] )
			$this->query_args[ 'post_status' ] = $args[ 'status' ];

		$this->query_args[ 'meta_query' ] = array();

		// By default exclude packing slips
		if ( ! isset( $args[ 'type' ] ) ) {
			array_push( 
				$this->query_args[ 'meta_query' ], 
				array( 
					'key' => '_invoice_exclude',
					'compare' => 'NOT EXISTS',
				)
			);
		}

		if ( isset( $args[ 'type' ] ) ) {
			array_push( 
				$this->query_args[ 'meta_query' ], 
				array(
					'key' => '_type',
					'value' => $args[ 'type' ],
					'compare' => '=',
				) 
			);
		}

		if ( $args[ 'end_date' ] || $args[ 'start_date' ] ) {
			$date_query = array( 'inclusive' => false );
			if ( ! empty( $args[ 'start_date' ] ) )
				$date_query[ 'after' ] = date( 'Y-m-d', strtotime( '-1 day', strtotime( $args['start_date'] ) ) );
			if ( ! empty( $args[ 'end_date' ] ) )
				$date_query[ 'before' ] = date( 'Y-m-d', strtotime( '+1 month', strtotime( $args['end_date'] ) ) );
			$this->query_args[ 'date_query' ] = array( $date_query );
		}
		$this->query = new WP_Query( $this->query_args );
	}

}

?>