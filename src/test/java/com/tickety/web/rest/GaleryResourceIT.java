package com.tickety.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tickety.IntegrationTest;
import com.tickety.domain.Galery;
import com.tickety.domain.enumeration.GaleryStatus;
import com.tickety.repository.GaleryRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GaleryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GaleryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final GaleryStatus DEFAULT_STATUS = GaleryStatus.ACTIVE;
    private static final GaleryStatus UPDATED_STATUS = GaleryStatus.INSTACTIVE;

    private static final String ENTITY_API_URL = "/api/galeries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GaleryRepository galeryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGaleryMockMvc;

    private Galery galery;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Galery createEntity(EntityManager em) {
        Galery galery = new Galery().name(DEFAULT_NAME).status(DEFAULT_STATUS);
        return galery;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Galery createUpdatedEntity(EntityManager em) {
        Galery galery = new Galery().name(UPDATED_NAME).status(UPDATED_STATUS);
        return galery;
    }

    @BeforeEach
    public void initTest() {
        galery = createEntity(em);
    }

    @Test
    @Transactional
    void createGalery() throws Exception {
        int databaseSizeBeforeCreate = galeryRepository.findAll().size();
        // Create the Galery
        restGaleryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(galery)))
            .andExpect(status().isCreated());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeCreate + 1);
        Galery testGalery = galeryList.get(galeryList.size() - 1);
        assertThat(testGalery.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testGalery.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createGaleryWithExistingId() throws Exception {
        // Create the Galery with an existing ID
        galery.setId(1L);

        int databaseSizeBeforeCreate = galeryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGaleryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(galery)))
            .andExpect(status().isBadRequest());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGaleries() throws Exception {
        // Initialize the database
        galeryRepository.saveAndFlush(galery);

        // Get all the galeryList
        restGaleryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(galery.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getGalery() throws Exception {
        // Initialize the database
        galeryRepository.saveAndFlush(galery);

        // Get the galery
        restGaleryMockMvc
            .perform(get(ENTITY_API_URL_ID, galery.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(galery.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingGalery() throws Exception {
        // Get the galery
        restGaleryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGalery() throws Exception {
        // Initialize the database
        galeryRepository.saveAndFlush(galery);

        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();

        // Update the galery
        Galery updatedGalery = galeryRepository.findById(galery.getId()).get();
        // Disconnect from session so that the updates on updatedGalery are not directly saved in db
        em.detach(updatedGalery);
        updatedGalery.name(UPDATED_NAME).status(UPDATED_STATUS);

        restGaleryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGalery.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGalery))
            )
            .andExpect(status().isOk());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
        Galery testGalery = galeryList.get(galeryList.size() - 1);
        assertThat(testGalery.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGalery.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingGalery() throws Exception {
        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();
        galery.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGaleryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, galery.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(galery))
            )
            .andExpect(status().isBadRequest());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGalery() throws Exception {
        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();
        galery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGaleryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(galery))
            )
            .andExpect(status().isBadRequest());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGalery() throws Exception {
        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();
        galery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGaleryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(galery)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGaleryWithPatch() throws Exception {
        // Initialize the database
        galeryRepository.saveAndFlush(galery);

        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();

        // Update the galery using partial update
        Galery partialUpdatedGalery = new Galery();
        partialUpdatedGalery.setId(galery.getId());

        restGaleryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGalery.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGalery))
            )
            .andExpect(status().isOk());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
        Galery testGalery = galeryList.get(galeryList.size() - 1);
        assertThat(testGalery.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testGalery.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateGaleryWithPatch() throws Exception {
        // Initialize the database
        galeryRepository.saveAndFlush(galery);

        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();

        // Update the galery using partial update
        Galery partialUpdatedGalery = new Galery();
        partialUpdatedGalery.setId(galery.getId());

        partialUpdatedGalery.name(UPDATED_NAME).status(UPDATED_STATUS);

        restGaleryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGalery.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGalery))
            )
            .andExpect(status().isOk());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
        Galery testGalery = galeryList.get(galeryList.size() - 1);
        assertThat(testGalery.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testGalery.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingGalery() throws Exception {
        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();
        galery.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGaleryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, galery.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(galery))
            )
            .andExpect(status().isBadRequest());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGalery() throws Exception {
        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();
        galery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGaleryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(galery))
            )
            .andExpect(status().isBadRequest());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGalery() throws Exception {
        int databaseSizeBeforeUpdate = galeryRepository.findAll().size();
        galery.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGaleryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(galery)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Galery in the database
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGalery() throws Exception {
        // Initialize the database
        galeryRepository.saveAndFlush(galery);

        int databaseSizeBeforeDelete = galeryRepository.findAll().size();

        // Delete the galery
        restGaleryMockMvc
            .perform(delete(ENTITY_API_URL_ID, galery.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Galery> galeryList = galeryRepository.findAll();
        assertThat(galeryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
