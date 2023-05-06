package com.tickety.web.rest;

import com.tickety.domain.Event;
import com.tickety.domain.Ticket;
import com.tickety.domain.UserAccount;
import com.tickety.repository.EventRepository;
import com.tickety.repository.TicketRepository;
import com.tickety.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.xml.crypto.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.tickety.domain.Ticket}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TicketResource {

    //
    private final EventRepository eventRepository;

    private final Logger log = LoggerFactory.getLogger(TicketResource.class);

    private static final String ENTITY_NAME = "ticket";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TicketRepository ticketRepository;

    public TicketResource(TicketRepository ticketRepository, EventRepository eventRepository) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * {@code POST  /tickets} : Create a new ticket.
     *
     * @param ticket the ticket to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ticket, or with status {@code 400 (Bad Request)} if the ticket has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tickets")
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) throws URISyntaxException {
        // Check if events has tickets
        Optional<Event> currentEvent = eventRepository.findById(ticket.getEvent().getId());
        // Update Event Total Tickets
        currentEvent.get().talTickets(currentEvent.get().getTalTickets() - 1);
        eventRepository.save(currentEvent.get());
        if (ticket.getDate() == null) {
            ticket.setDate(LocalDate.now());
        }
        log.debug("REST request to save Ticket : {}", ticket);
        if (ticket.getId() != null) {
            throw new BadRequestAlertException("A new ticket cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ticket result = ticketRepository.save(ticket);
        return ResponseEntity
            .created(new URI("/api/tickets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tickets/:id} : Updates an existing ticket.
     *
     * @param id the id of the ticket to save.
     * @param ticket the ticket to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticket,
     * or with status {@code 400 (Bad Request)} if the ticket is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ticket couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tickets/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable(value = "id", required = false) final Long id, @RequestBody Ticket ticket)
        throws URISyntaxException {
        log.debug("REST request to update Ticket : {}, {}", id, ticket);
        if (ticket.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticket.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ticket result = ticketRepository.save(ticket);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticket.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tickets/:id} : Partial updates given fields of an existing ticket, field will ignore if it is null
     *
     * @param id the id of the ticket to save.
     * @param ticket the ticket to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ticket,
     * or with status {@code 400 (Bad Request)} if the ticket is not valid,
     * or with status {@code 404 (Not Found)} if the ticket is not found,
     * or with status {@code 500 (Internal Server Error)} if the ticket couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tickets/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ticket> partialUpdateTicket(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ticket ticket
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ticket partially : {}, {}", id, ticket);
        if (ticket.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ticket.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ticketRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ticket> result = ticketRepository
            .findById(ticket.getId())
            .map(existingTicket -> {
                if (ticket.getDate() != null) {
                    existingTicket.setDate(ticket.getDate());
                }
                if (ticket.getTicketStatus() != null) {
                    existingTicket.setTicketStatus(ticket.getTicketStatus());
                }

                return existingTicket;
            })
            .map(ticketRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ticket.getId().toString())
        );
    }

    /**
     * {@code GET  /tickets} : get all the tickets.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tickets in body.
     */
    @GetMapping("/tickets")
    public List<Ticket> getAllTickets() {
        log.debug("REST request to get all Tickets");
        return ticketRepository.findAll();
    }

    /**
     * {@code GET  /tickets/:id} : get the "id" ticket.
     *
     * @param id the id of the ticket to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ticket, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tickets/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable Long id) {
        log.debug("REST request to get Ticket : {}", id);
        Optional<Ticket> ticket = ticketRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ticket);
    }

    /**
     * {@code DELETE  /tickets/:id} : delete the "id" ticket.
     *
     * @param id the id of the ticket to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tickets/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        log.debug("REST request to delete Ticket : {}", id);
        ticketRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/tickets/event/{eventId}")
    public List<Ticket> getTicketsByEvent(@PathVariable Long eventId) {
        Event event = new Event();
        event.setId(eventId);

        return this.ticketRepository.findByEvent(event);
    }
}
