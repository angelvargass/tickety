package com.tickety.web.rest;

import com.tickety.domain.Galery;
import com.tickety.repository.GaleryRepository;
import com.tickety.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.tickety.domain.Galery}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GaleryResource {

    private final Logger log = LoggerFactory.getLogger(GaleryResource.class);

    private static final String ENTITY_NAME = "galery";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GaleryRepository galeryRepository;

    public GaleryResource(GaleryRepository galeryRepository) {
        this.galeryRepository = galeryRepository;
    }

    /**
     * {@code POST  /galeries} : Create a new galery.
     *
     * @param galery the galery to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new galery, or with status {@code 400 (Bad Request)} if the galery has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/galeries")
    public ResponseEntity<Galery> createGalery(@RequestBody Galery galery) throws URISyntaxException {
        log.debug("REST request to save Galery : {}", galery);
        if (galery.getId() != null) {
            throw new BadRequestAlertException("A new galery cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Galery result = galeryRepository.save(galery);
        return ResponseEntity
            .created(new URI("/api/galeries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /galeries/:id} : Updates an existing galery.
     *
     * @param id the id of the galery to save.
     * @param galery the galery to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated galery,
     * or with status {@code 400 (Bad Request)} if the galery is not valid,
     * or with status {@code 500 (Internal Server Error)} if the galery couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/galeries/{id}")
    public ResponseEntity<Galery> updateGalery(@PathVariable(value = "id", required = false) final Long id, @RequestBody Galery galery)
        throws URISyntaxException {
        log.debug("REST request to update Galery : {}, {}", id, galery);
        if (galery.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, galery.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!galeryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Galery result = galeryRepository.save(galery);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, galery.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /galeries/:id} : Partial updates given fields of an existing galery, field will ignore if it is null
     *
     * @param id the id of the galery to save.
     * @param galery the galery to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated galery,
     * or with status {@code 400 (Bad Request)} if the galery is not valid,
     * or with status {@code 404 (Not Found)} if the galery is not found,
     * or with status {@code 500 (Internal Server Error)} if the galery couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/galeries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Galery> partialUpdateGalery(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Galery galery
    ) throws URISyntaxException {
        log.debug("REST request to partial update Galery partially : {}, {}", id, galery);
        if (galery.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, galery.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!galeryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Galery> result = galeryRepository
            .findById(galery.getId())
            .map(existingGalery -> {
                if (galery.getName() != null) {
                    existingGalery.setName(galery.getName());
                }
                if (galery.getStatus() != null) {
                    existingGalery.setStatus(galery.getStatus());
                }

                return existingGalery;
            })
            .map(galeryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, galery.getId().toString())
        );
    }

    /**
     * {@code GET  /galeries} : get all the galeries.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of galeries in body.
     */
    @GetMapping("/galeries")
    public List<Galery> getAllGaleries(@RequestParam(required = false) String filter) {
        if ("event-is-null".equals(filter)) {
            log.debug("REST request to get all Galerys where event is null");
            return StreamSupport
                .stream(galeryRepository.findAll().spliterator(), false)
                .filter(galery -> galery.getEvent() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Galeries");
        return galeryRepository.findAll();
    }

    /**
     * {@code GET  /galeries/:id} : get the "id" galery.
     *
     * @param id the id of the galery to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the galery, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/galeries/{id}")
    public ResponseEntity<Galery> getGalery(@PathVariable Long id) {
        log.debug("REST request to get Galery : {}", id);
        Optional<Galery> galery = galeryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(galery);
    }

    /**
     * {@code DELETE  /galeries/:id} : delete the "id" galery.
     *
     * @param id the id of the galery to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/galeries/{id}")
    public ResponseEntity<Void> deleteGalery(@PathVariable Long id) {
        log.debug("REST request to delete Galery : {}", id);
        galeryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
