package com.tickety.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tickety.IntegrationTest;
import com.tickety.domain.UserAccount;
import com.tickety.domain.enumeration.Gender;
import com.tickety.repository.UserAccountRepository;
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
 * Integration tests for the {@link UserAccountResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserAccountResourceIT {

    private static final Gender DEFAULT_GENDERU = Gender.MASCULINO;
    private static final Gender UPDATED_GENDERU = Gender.FEMENINO;

    private static final String ENTITY_API_URL = "/api/user-accounts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserAccountMockMvc;

    private UserAccount userAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserAccount createEntity(EntityManager em) {
        UserAccount userAccount = new UserAccount().genderu(DEFAULT_GENDERU);
        return userAccount;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserAccount createUpdatedEntity(EntityManager em) {
        UserAccount userAccount = new UserAccount().genderu(UPDATED_GENDERU);
        return userAccount;
    }

    @BeforeEach
    public void initTest() {
        userAccount = createEntity(em);
    }

    @Test
    @Transactional
    void createUserAccount() throws Exception {
        int databaseSizeBeforeCreate = userAccountRepository.findAll().size();
        // Create the UserAccount
        restUserAccountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userAccount)))
            .andExpect(status().isCreated());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeCreate + 1);
        UserAccount testUserAccount = userAccountList.get(userAccountList.size() - 1);
        assertThat(testUserAccount.getGenderu()).isEqualTo(DEFAULT_GENDERU);
    }

    @Test
    @Transactional
    void createUserAccountWithExistingId() throws Exception {
        // Create the UserAccount with an existing ID
        userAccount.setId(1L);

        int databaseSizeBeforeCreate = userAccountRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserAccountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userAccount)))
            .andExpect(status().isBadRequest());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserAccounts() throws Exception {
        // Initialize the database
        userAccountRepository.saveAndFlush(userAccount);

        // Get all the userAccountList
        restUserAccountMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].genderu").value(hasItem(DEFAULT_GENDERU.toString())));
    }

    @Test
    @Transactional
    void getUserAccount() throws Exception {
        // Initialize the database
        userAccountRepository.saveAndFlush(userAccount);

        // Get the userAccount
        restUserAccountMockMvc
            .perform(get(ENTITY_API_URL_ID, userAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userAccount.getId().intValue()))
            .andExpect(jsonPath("$.genderu").value(DEFAULT_GENDERU.toString()));
    }

    @Test
    @Transactional
    void getNonExistingUserAccount() throws Exception {
        // Get the userAccount
        restUserAccountMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserAccount() throws Exception {
        // Initialize the database
        userAccountRepository.saveAndFlush(userAccount);

        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();

        // Update the userAccount
        UserAccount updatedUserAccount = userAccountRepository.findById(userAccount.getId()).get();
        // Disconnect from session so that the updates on updatedUserAccount are not directly saved in db
        em.detach(updatedUserAccount);
        updatedUserAccount.genderu(UPDATED_GENDERU);

        restUserAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserAccount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserAccount))
            )
            .andExpect(status().isOk());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
        UserAccount testUserAccount = userAccountList.get(userAccountList.size() - 1);
        assertThat(testUserAccount.getGenderu()).isEqualTo(UPDATED_GENDERU);
    }

    @Test
    @Transactional
    void putNonExistingUserAccount() throws Exception {
        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();
        userAccount.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userAccount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserAccount() throws Exception {
        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();
        userAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserAccount() throws Exception {
        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();
        userAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserAccountMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userAccount)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserAccountWithPatch() throws Exception {
        // Initialize the database
        userAccountRepository.saveAndFlush(userAccount);

        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();

        // Update the userAccount using partial update
        UserAccount partialUpdatedUserAccount = new UserAccount();
        partialUpdatedUserAccount.setId(userAccount.getId());

        partialUpdatedUserAccount.genderu(UPDATED_GENDERU);

        restUserAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserAccount))
            )
            .andExpect(status().isOk());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
        UserAccount testUserAccount = userAccountList.get(userAccountList.size() - 1);
        assertThat(testUserAccount.getGenderu()).isEqualTo(UPDATED_GENDERU);
    }

    @Test
    @Transactional
    void fullUpdateUserAccountWithPatch() throws Exception {
        // Initialize the database
        userAccountRepository.saveAndFlush(userAccount);

        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();

        // Update the userAccount using partial update
        UserAccount partialUpdatedUserAccount = new UserAccount();
        partialUpdatedUserAccount.setId(userAccount.getId());

        partialUpdatedUserAccount.genderu(UPDATED_GENDERU);

        restUserAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserAccount))
            )
            .andExpect(status().isOk());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
        UserAccount testUserAccount = userAccountList.get(userAccountList.size() - 1);
        assertThat(testUserAccount.getGenderu()).isEqualTo(UPDATED_GENDERU);
    }

    @Test
    @Transactional
    void patchNonExistingUserAccount() throws Exception {
        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();
        userAccount.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserAccount() throws Exception {
        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();
        userAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserAccount() throws Exception {
        int databaseSizeBeforeUpdate = userAccountRepository.findAll().size();
        userAccount.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserAccountMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userAccount))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserAccount in the database
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserAccount() throws Exception {
        // Initialize the database
        userAccountRepository.saveAndFlush(userAccount);

        int databaseSizeBeforeDelete = userAccountRepository.findAll().size();

        // Delete the userAccount
        restUserAccountMockMvc
            .perform(delete(ENTITY_API_URL_ID, userAccount.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserAccount> userAccountList = userAccountRepository.findAll();
        assertThat(userAccountList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
