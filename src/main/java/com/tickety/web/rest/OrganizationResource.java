package com.tickety.web.rest;

import com.tickety.domain.Authority;
import com.tickety.domain.Organization;
import com.tickety.domain.User;
import com.tickety.domain.UserAccount;
import com.tickety.repository.AuthorityRepository;
import com.tickety.repository.OrganizationRepository;
import com.tickety.repository.UserAccountRepository;
import com.tickety.repository.UserRepository;
import com.tickety.security.SecurityUtils;
import com.tickety.service.MailService;
import com.tickety.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.tickety.domain.Organization}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrganizationResource {

    private final Logger log = LoggerFactory.getLogger(OrganizationResource.class);

    private static final String ENTITY_NAME = "organization";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizationRepository organizationRepository;
    private final UserAccountRepository userAccountRepository;
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final MailService mailService;

    public OrganizationResource(
        OrganizationRepository organizationRepository,
        UserAccountRepository userAccountRepository,
        UserRepository userRepository,
        AuthorityRepository authorityRepository,
        MailService mailService
    ) {
        this.organizationRepository = organizationRepository;
        this.userAccountRepository = userAccountRepository;
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
        this.mailService = mailService;
    }

    /**
     * {@code POST  /organizations} : Create a new organization.
     *
     * @param organization the organization to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organization, or with status {@code 400 (Bad Request)} if the organization has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organizations")
    public ResponseEntity<Organization> createOrganization(@RequestBody Organization organization) throws Exception {
        log.debug("REST request to save Organization : {}", organization);
        if (organization.getId() != null) {
            throw new BadRequestAlertException("A new organization cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        if (!login.isPresent()) {
            throw new Exception("Bad login");
        }

        Authority organizationAuthority = authorityRepository.findByName("ROLE_ORGANIZATION").get();
        User user = userRepository.findOneByLogin(login.get()).get();
        user.getAuthorities().add(organizationAuthority);
        userRepository.save(user);

        UserAccount userAccount = userAccountRepository.findByUser(user).get();
        Organization result = organizationRepository.save(organization);

        userAccount.setOrganization(result);
        userAccountRepository.save(userAccount);
        return ResponseEntity
            .created(new URI("/api/organizations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /organizations/:id} : Updates an existing organization.
     *
     * @param id the id of the organization to save.
     * @param organization the organization to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organization,
     * or with status {@code 400 (Bad Request)} if the organization is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organization couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/organizations/{id}")
    public ResponseEntity<Organization> updateOrganization(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Organization organization
    ) throws URISyntaxException {
        log.debug("REST request to update Organization : {}, {}", id, organization);
        if (organization.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organization.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organizationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Organization result = organizationRepository.save(organization);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organization.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /organizations/:id} : Partial updates given fields of an existing organization, field will ignore if it is null
     *
     * @param id the id of the organization to save.
     * @param organization the organization to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organization,
     * or with status {@code 400 (Bad Request)} if the organization is not valid,
     * or with status {@code 404 (Not Found)} if the organization is not found,
     * or with status {@code 500 (Internal Server Error)} if the organization couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/organizations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Organization> partialUpdateOrganization(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Organization organization
    ) throws URISyntaxException {
        log.debug("REST request to partial update Organization partially : {}, {}", id, organization);
        if (organization.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, organization.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!organizationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Organization> result = organizationRepository
            .findById(organization.getId())
            .map(existingOrganization -> {
                if (organization.getName() != null) {
                    existingOrganization.setName(organization.getName());
                }
                if (organization.getOwner() != null) {
                    existingOrganization.setOwner(organization.getOwner());
                }

                return existingOrganization;
            })
            .map(organizationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organization.getId().toString())
        );
    }

    /**
     * {@code GET  /organizations} : get all the organizations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organizations in body.
     */
    @GetMapping("/organizations")
    public List<Organization> getAllOrganizations() {
        log.debug("REST request to get all Organizations");
        return organizationRepository.findAll();
    }

    /**
     * {@code GET  /organizations/:id} : get the "id" organization.
     *
     * @param id the id of the organization to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organization, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organizations/{id}")
    public ResponseEntity<Organization> getOrganization(@PathVariable Long id) {
        log.debug("REST request to get Organization : {}", id);
        Optional<Organization> organization = organizationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(organization);
    }

    /**
     * {@code DELETE  /organizations/:id} : delete the "id" organization.
     *
     * @param id the id of the organization to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/organizations/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        log.debug("REST request to delete Organization : {}", id);
        organizationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/organizations/{id}/invite")
    public void invitePromoterToOrganization(@PathVariable(value = "id") final Long id, @RequestBody String email) {
        Optional<User> registeredUser = userRepository.findOneByLogin(email);
        Organization organization = organizationRepository.findById(id).get();

        if (registeredUser.isPresent()) {
            throw new BadRequestAlertException("User with email ", registeredUser.get().getEmail(), "already exists");
        }

        mailService.sendPromoterToOrganizationInviteMail(organization, email);
    }
}
