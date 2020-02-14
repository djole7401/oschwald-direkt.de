<?php

/*
* Add your own functions here. You can also copy some of the theme functions into this file. 
* Wordpress will use those functions instead of the original functions then.
*/


add_filter( 'woocommerce_dropdown_variation_attribute_options_args', 'dropdown_variation_attribute_options', 10, 1 );

function dropdown_variation_attribute_options( $args ){

    if ( 'pa_myattribute' == $args['attribute'] ) {
		$args['show_option_none'] = __( 'Select my attribute name', 'my-textdomain' );
	}

    return $args;
}





add_filter( 'woocommerce_product_tabs', 'wp_bibel_de_rename_woocommerce_product_tabs', 98 );

function wp_bibel_de_rename_woocommerce_product_tabs( $tabs ) {
	$tabs['additional_information']['title'] = __( 'Spezifikationen' );	// Rename the additional information tab

	return $tabs;
}


add_filter( 'woocommerce_product_additional_information_heading', 'woocommerce_change_product_additional_information_heading');

function woocommerce_change_product_additional_information_heading($heading) {
	$heading = __( 'Spezifikationen', 'woocommerce' );
	return $heading;
}

remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );

add_action( 'woocommerce_after_single_product_summary', 'oschwald_abbinder_custom_action', 5 );
 
function oschwald_abbinder_custom_action() {
	if( is_product() && has_term( 'musterabbinder', 'product_tag' ) ){
//	if( is_product() && has_term( 'Naturteppiche von OSCHWALD', 'product_cat' ) ){
		echo '<hr />
		<div class="flex_column_table av-equal-height-column-flextable -flextable" style="padding-bottom:30px;">
		<div class="flex_column av_one_third  flex_column_table_cell av-equal-height-column av-align-top av-zero-column-padding  first el_after_av_textblock  el_before_av_one_third  column-top-margin" style="border-width:1px; border-color:#c9c9c9; border-style:solid; box-shadow: 0 0 10px 0 #c6c6c6; padding:13px; border-radius:0px;">
		<section class="av_textblock_section " itemscope="itemscope" itemtype="https://schema.org/CreativeWork">
			<div class="avia_textblock  " itemprop="text"><h3>Musterbestellungen, Beratung und hilfreiche Tipps für Ihren neuen Naturteppichboden</h3>
<p><img src="http://wordpress.p494915.webspaceconfig.de/wp-content/uploads/2019/01/muster.jpg" alt="Musterbestellung"></p>
<p>Finden Sie auf unserer Boden aus Natur-Infoseite kostenlose Teppichbodenmuster, alles rund um Beratung und hilfreiche Tipps für unserer „Boden aus Natur“-Kollektion.</p>
<p><a  class="thisismyurl_external external-links-new-window"href="https://www.boden-aus-natur.de/service/musteranfrage-teppiche/" target="_blank" rel="noopener">Teppichmuster bestellen</a><br>
<a  class="thisismyurl_external external-links-new-window"href="https://www.boden-aus-natur.de/einsatzbereiche/teppichberater/" target="_blank" rel="noopener">Online-Teppichberater</a></p>

			</div>
		</section>
	</div>
	<div class="av-flex-placeholder"></div>
	<div class="flex_column av_one_third  flex_column_table_cell av-equal-height-column av-align-top av-zero-column-padding  el_after_av_one_third  el_before_av_one_third  column-top-margin" style="border-width:1px; border-color:#c9c9c9; border-style:solid; box-shadow: 0 0 10px 0 #c6c6c6; padding:13px; border-radius:0px; ">
		<section class="av_textblock_section " itemscope="itemscope" itemtype="https://schema.org/CreativeWork">
			<div class="avia_textblock  " itemprop="text"><h3>TEPPICHBODEN: WIE VERMESSE ICH RICHTIG?</h3>
			<p><img src="http://wordpress.p494915.webspaceconfig.de/wp-content/uploads/2019/01/textblock-raeume.png" alt="Musterbestellung"></p><p>Es ist besonders ärgerlich, wenn der schöne neue Teppichboden durch das falsche Ausmessen zu kurz ist und man unnötige Nähte in Kauf nehmen muss.</p><p><a class="thisismyurl_external external-links-new-window" href="https://www.boden-aus-natur.de/service/teppichboden-richtig-ausmessen/" target="_blank" rel="noopener">Räume richtig ausmessen</a></p>
			</div>
		</section>
	</div>
	<div class="av-flex-placeholder"></div>
	<div class="flex_column av_one_third  flex_column_table_cell av-equal-height-column av-align-top av-zero-column-padding  el_after_av_one_third  avia-builder-el-last  column-top-margin" style="border-width:1px; border-color:#c9c9c9; border-style:solid; box-shadow: 0 0 10px 0 #c6c6c6; padding:13px; border-radius:0px; ">
		<section class="av_textblock_section " itemscope="itemscope" itemtype="https://schema.org/CreativeWork">
			<div class="avia_textblock  " itemprop="text"><h3>Verlegeservice gesucht?</h3>
			<p><img src="http://wordpress.p494915.webspaceconfig.de/wp-content/uploads/2019/01/textblock-fachhaendler.png" alt="Musterbestellung"></p><p>Für die Verlegung Ihres Wunschbodens stehen Ihnen unsere Fachhändler gerne zur Verfügung.</p><p><a class="thisismyurl_external external-links-new-window" href="https://www.boden-aus-natur.de/service/fachhaendlerverzeichnis/" target="_blank" rel="noopener">Zum Fachhändlerverzeichnis</a></p>
			</div>
		</section>
	</div>
	</div>
';
	}
}

/*
add_filter( 'woocommerce_locate_template', 'so_25789472_locate_template', 10, 3 );

function so_25789472_locate_template( $template, $template_name, $template_path ){

    // on single posts with mock category and only for single-product/something.php templates
    if( is_product() && has_term( 'mock', 'product_cat' ) && strpos( $template_name, 'single-product/') !== false ){

        // replace single-product with single-product-mock in template name
        $mock_template_name = str_replace("single-product/", "single-product-mock/", $template_name );

        // look for templates in the single-product-mock/ folder
        $mock_template = locate_template(
            array(
                trailingslashit( $template_path ) . $mock_template_name,
                $mock_template_name
            )
        );

        // if found, replace template with that in the single-product-mock/ folder
        if ( $mock_template ) {
            $template = $mock_template;
        }
    }

    return $template;
}
*/


/*
function oschwald_abbinder_custom_action() {
        global $post;
        $terms = get_the_terms( $post->ID, 'product_cat' );
        $nterms = get_the_terms( $post->ID, 'product_tag'  );
        foreach ($terms  as $term  ) {
            $product_cat_id = $term->term_id;
            $product_cat_name = $term->name;
            break;
        }

       echo $product_cat_id;
}
*/