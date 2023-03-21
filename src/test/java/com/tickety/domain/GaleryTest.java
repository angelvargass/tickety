package com.tickety.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tickety.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GaleryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Galery.class);
        Galery galery1 = new Galery();
        galery1.setId(1L);
        Galery galery2 = new Galery();
        galery2.setId(galery1.getId());
        assertThat(galery1).isEqualTo(galery2);
        galery2.setId(2L);
        assertThat(galery1).isNotEqualTo(galery2);
        galery1.setId(null);
        assertThat(galery1).isNotEqualTo(galery2);
    }
}
